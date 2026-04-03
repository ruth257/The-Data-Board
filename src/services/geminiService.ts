import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { BoardMetrics, Centrality, Scenario, Tile } from "../types";

const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 5, initialDelay = 1000): Promise<T> => {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const message = error.message?.toLowerCase() || "";
      const is503 = message.includes("503") || message.includes("unavailable") || message.includes("high demand") || message.includes("overloaded");
      const is429 = message.includes("429") || message.includes("quota") || message.includes("rate limit") || message.includes("resource_exhausted");
      const isWarmup = message.includes("SERVER_WARMUP");
      
      // Retry on 503 (busy) or Warmup
      if ((is503 || isWarmup) && i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`AI Service busy or warming up. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Handle 429 (Quota)
      if (is429) {
        // Try to extract retry delay from the error message (e.g., "Please retry in 34s")
        const retryMatch = message.match(/retry in ([\d.]+)s/);
        if (retryMatch && i < maxRetries - 1) {
          const waitTime = (parseFloat(retryMatch[1]) * 1000) + 1000; // Add 1s buffer
          if (waitTime < 65000) { // Only auto-retry if wait is reasonable (< 65s)
            console.warn(`Quota reached (429). Waiting ${waitTime}ms before retry... (Attempt ${i + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }
        
        // If we can't retry or it's a long wait, throw a clean error
        throw new Error("QUOTA_EXHAUSTED: You have reached the AI service limit. Please wait a moment, or provide your own API key in Settings to bypass shared limits.");
      }

      throw error;
    }
  }
  throw lastError;
};

const callAIProxy = async (model: string, contents: any, config: any) => {
  return await withRetry(async () => {
    const localKey = localStorage.getItem("GEMINI_API_KEY");
    
    // If user has a private key in localStorage, use it directly (client-side)
    if (localKey) {
      console.log("[Data Board] Using local API key from Settings.");
      const ai = new GoogleGenAI({ apiKey: localKey });
      const result = await ai.models.generateContent({ model, contents, config });
      return { text: result.text || "" };
    }

    // Otherwise, use the shared server-side proxy
    console.log("[Data Board] Using server-side AI proxy.");
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, contents, config }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        let errorMessage = "AI request failed";
        
        // Extract the most relevant error message
        if (error.error) {
          if (typeof error.error === 'object') {
            errorMessage = error.error.message || JSON.stringify(error.error);
          } else {
            errorMessage = String(error.error);
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        // If the error message is still a JSON string (sometimes happens with ApiError), try to parse it
        if (errorMessage.includes('{"error":')) {
          try {
            const nested = JSON.parse(errorMessage);
            if (nested.error?.message) errorMessage = nested.error.message;
          } catch (e) { /* ignore */ }
        }

        throw new Error(errorMessage);
      } else {
        const text = await response.text();
        if (text.includes("Please wait while your application starts")) {
          throw new Error("SERVER_WARMUP: The server is still starting up. Please wait a few seconds and try again.");
        }
        console.error(`[Data Board] Server error (${response.status}):`, text);
        throw new Error(`Server error (${response.status}). ${text.includes("503") ? "The AI service is currently overloaded. Please try again in a few seconds." : "Please check server logs."}`);
      }
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Server returned non-JSON response:", text);
      throw new Error("Invalid response from server. Expected JSON.");
    }

    const data = await response.json();
    return { text: data.text || "" };
  });
};

const cleanJsonResponse = (text: string) => {
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```json\n?/, "").replace(/\n?```$/, "");
  }
  return cleaned;
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export async function evaluateWord(scenario: Scenario, word: string, existingWords: string[] = []): Promise<Tile> {
  const response = await callAIProxy("gemini-3-flash-preview", 
    `
      Evaluate the handle "${word}" for the subject: "${scenario.title}".
      
      THE HUMAN DOMAIN DIRECTIVE:
      - Use "Human Domain Vocabulary": descriptive segments, demographics, and clear factual categories.
      - Examples: "Female", "Global South", "High-Income", "Mobile Users", "Weekends", "First Class".
      - FORBIDDEN: Do NOT use abstract analytical handles (e.g., "Logistical Scarcity", "Socio-Economic Stratification", "Friction-Gravity").
      - The 'correctedWord' should be a simple, recognizable term that a human observer would use to describe a segment of data.
      - If the input word is already a simple human term, do NOT change it.
      
      THE EVIDENCE COHERENCE DIRECTIVE:
      - The 'explanation' MUST be a specific, data-grounded observation that provides "Sharp Evidence".
      - Ensure the handle is globally coherent within the reasoning space of the scenario.
      
      CENTRALITY CATEGORIES:
      - DOMINANT: A major causal driver (Green).
      - PRESENT: A secondary factor (Yellow).
      - EDGE_CASE: A structural tension point or a false assumption (Red).
      
      Context: ${scenario.context}
      Outcomes: ${scenario.outcomes.join(", ")}
      Existing Board: ${existingWords.join(", ")}
      
      Return JSON: correctedWord, centrality, explanation, dataInsight, source, category, isAIConfirmed, relevanceScore, specificityScore.
    `,
    {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correctedWord: { type: Type.STRING },
          centrality: { type: Type.STRING, enum: ["DOMINANT", "PRESENT", "EDGE_CASE"] },
          explanation: { type: Type.STRING },
          dataInsight: { type: Type.STRING },
          source: { type: Type.STRING },
          category: { type: Type.STRING },
          isAIConfirmed: { type: Type.BOOLEAN },
          relevanceScore: { type: Type.NUMBER },
          specificityScore: { type: Type.NUMBER },
        },
        required: ["correctedWord", "centrality", "explanation", "dataInsight", "source", "category", "isAIConfirmed", "relevanceScore", "specificityScore"],
      },
    }
  );

  const result = JSON.parse(cleanJsonResponse(response.text || "{}"));
  
  return {
    id: generateId(),
    word: result.correctedWord || word,
    centrality: result.centrality as Centrality,
    explanation: result.explanation || "No explanation provided.",
    dataInsight: result.dataInsight || "No specific data insight available.",
    source: result.source || "General Knowledge",
    category: result.category || "General",
    isAIConfirmed: result.isAIConfirmed ?? true,
    relevanceScore: result.relevanceScore || 50,
    specificityScore: result.specificityScore || 50,
  };
}

export async function generateBestVocabulary(scenario: Scenario, existingWords: string[] = []): Promise<Tile[]> {
  const response = await callAIProxy("gemini-3-flash-preview",
    `
      Suggest "Human Domain Vocabulary" for the subject: "${scenario.title}".
      
      THE HUMAN DOMAIN METHOD:
      - Create a set of 5-8 handles that a human observer or data analyst would first identify as "Facts" or "Segments".
      - Use descriptive segments, demographics, and clear factual categories.
      - Examples: "Female", "Global South", "English-speaking countries", "Mobile Users", "Weekends", "First Class".
      - FORBIDDEN: Do NOT use "Smartass" analytical handles (e.g., "Logistical Scarcity", "Production-Velocity", "Inertia").
      - These should be the "Building Blocks" that ground the initial reasoning.
      - Focus on "What" and "Who" before "Why".
      
      THE HANDLE DIRECTIVE:
      - The 'word' MUST be a simple, recognizable handle (1-2 words max).
      - The 'explanation' MUST be the "Sharp Evidence" that grounds this concept in the data.
      
      CENTRALITY CATEGORIES:
      - DOMINANT: A major causal driver (Green).
      - PRESENT: A secondary factor (Yellow).
      - EDGE_CASE: A structural tension point or an outlier (Red).
      
      Context: ${scenario.context}
      Outcomes: ${scenario.outcomes.join(", ")}
      Existing: ${existingWords.join(", ")}
      
      Return JSON array: word, centrality, explanation, dataInsight, source, category, isAIConfirmed, relevanceScore, specificityScore.
      
      CRITICAL: You MUST return at least 5 unique human-readable handles.
    `,
    {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            centrality: { type: Type.STRING, enum: ["DOMINANT", "PRESENT", "EDGE_CASE"] },
            explanation: { type: Type.STRING },
            dataInsight: { type: Type.STRING },
            source: { type: Type.STRING },
            category: { type: Type.STRING },
            isAIConfirmed: { type: Type.BOOLEAN },
            relevanceScore: { type: Type.NUMBER },
            specificityScore: { type: Type.NUMBER },
          },
          required: ["word", "centrality", "explanation", "dataInsight", "source", "category", "isAIConfirmed", "relevanceScore", "specificityScore"],
        },
      },
    }
  );

  const resultsRaw = response.text || "[]";
  console.log("Raw AI Response for Vocabulary:", resultsRaw);
  
  let results;
  try {
    results = JSON.parse(cleanJsonResponse(resultsRaw));
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    results = [];
  }
  
  return (Array.isArray(results) ? results : []).map((result: any) => ({
    id: generateId(),
    word: result.word || "Unknown",
    centrality: (result.centrality as Centrality) || Centrality.PRESENT,
    explanation: result.explanation || "No explanation provided.",
    dataInsight: result.dataInsight || "No specific data insight available.",
    source: result.source || "General Knowledge",
    category: result.category || "General",
    isAIConfirmed: result.isAIConfirmed ?? true,
    relevanceScore: result.relevanceScore || 50,
    specificityScore: result.specificityScore || 50,
  }));
}

export async function auditCausalTension(scenario: Scenario, tile: Tile): Promise<Tile> {
  const response = await callAIProxy("gemini-3-flash-preview",
    `
      Perform a "Causal Audit" on the handle "${tile.word}" for the subject: "${scenario.title}".
      
      THE SURGICAL TENSION DIRECTIVE:
      - Identify the "Shadow" or "Pseudo-Antonym" of this concept that defines its causal boundary.
      - If "${tile.word}" is a driver, what is the counter-driver or the hidden cost?
      - The goal is to create a "Tension Pair" that supercharges human deduction.
      - Keep the "Shadow Handle" grounded and recognizable. Avoid overly abstract jargon.
      - Example: If the tile is "First Class", the Shadow might be "Lifeboat Access" or "Proximity to Deck".
      
      Context: ${scenario.context}
      Current Tile Explanation: ${tile.explanation}
      
      Return JSON: word (The Shadow Handle), centrality (Usually EDGE_CASE or PRESENT), explanation (The Causal Tension Evidence), dataInsight, source, category, isAIConfirmed, relevanceScore, specificityScore.
    `,
    {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          centrality: { type: Type.STRING, enum: ["DOMINANT", "PRESENT", "EDGE_CASE"] },
          explanation: { type: Type.STRING },
          dataInsight: { type: Type.STRING },
          source: { type: Type.STRING },
          category: { type: Type.STRING },
          isAIConfirmed: { type: Type.BOOLEAN },
          relevanceScore: { type: Type.NUMBER },
          specificityScore: { type: Type.NUMBER },
        },
        required: ["word", "centrality", "explanation", "dataInsight", "source", "category", "isAIConfirmed", "relevanceScore", "specificityScore"],
      },
    }
  );

  const result = JSON.parse(cleanJsonResponse(response.text || "{}"));
  return {
    id: generateId(),
    word: result.word,
    centrality: result.centrality as Centrality,
    explanation: result.explanation,
    dataInsight: result.dataInsight,
    source: result.source,
    category: result.category,
    isAIConfirmed: result.isAIConfirmed ?? true,
    relevanceScore: result.relevanceScore || 50,
    specificityScore: result.specificityScore || 50,
  };
}

export async function calculateBoardMetrics(scenario: Scenario, tiles: Tile[]): Promise<BoardMetrics> {
  if (!Array.isArray(tiles) || tiles.length === 0) {
    return {
      cohesion: 0,
      coverage: 0,
      entropy: 0,
      sharpness: 0,
      explanation: "No data on board to evaluate."
    };
  }

  const response = await callAIProxy("gemini-3-flash-preview",
    `
      Evaluate the "Eureka Potential" of this board for scenario: "${scenario.title}".
      
      THE BOARD (Human Domain Vocabulary):
      ${tiles.map(t => `- [${t.word}]: ${t.explanation}`).join("\n")}
      
      THE DEDUCIBLE SPACE FORMALIZATION (AI Synthesis):
      - This is where you elevate the "Human" terms into "Analytical Handles".
      - For the 'synthesisSuggestions', identify groups of human terms and suggest a single "Deducible Space" handle to replace them.
      - These handles should be punchy, analytical, and tension-bearing (e.g., "Production-Velocity", "Friction-Gravity", "Inertia").
      - Use "Pseudo-Antonyms" to introduce structural tension.
      
      THE SEMANTIC MAP (Links):
      - Identify 3-6 "Causal Links" between the tiles CURRENTLY ON THE BOARD.
      - CRITICAL: The 'source' and 'target' MUST EXACTLY MATCH the [word] from the list above.
      - If you use a word that is not in the list, the link will be broken.
      
      METRICS DEFINITION (0-100):
      - COHESION: How well do these specific handles connect to form a unified argument?
      - COVERAGE: Do we have a balance of DOMINANT, PRESENT, and EDGE_CASE handles?
      - SHARPNESS: Average specificity of the evidence backing these handles.
      
      SYNTHESIS (The Eureka Moment): 
      - Provide a 1-sentence "Headline Insight" that summarizes the inevitable conclusion using the elevated analytical vocabulary.
      - The insight should feel like it was "found" by looking at the handles above.
      
      Return JSON: cohesion, coverage, entropy, sharpness, explanation, synthesis, emergentPatterns, links, coverageBreakdown (dominant, present, edgeCase), synthesisSuggestions.
    `,
    {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cohesion: { type: Type.NUMBER },
          coverage: { type: Type.NUMBER },
          entropy: { type: Type.NUMBER },
          sharpness: { type: Type.NUMBER },
          explanation: { type: Type.STRING },
          synthesis: { type: Type.STRING },
          emergentPatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
          links: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING },
                target: { type: Type.STRING },
                label: { type: Type.STRING },
              },
              required: ["source", "target", "label"],
            },
          },
          coverageBreakdown: {
            type: Type.OBJECT,
            properties: {
              dominant: { type: Type.NUMBER },
              present: { type: Type.NUMBER },
              edgeCase: { type: Type.NUMBER },
            },
            required: ["dominant", "present", "edgeCase"],
          },
          synthesisSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.ARRAY, items: { type: Type.STRING } },
                replacement: { type: Type.STRING },
                reasoning: { type: Type.STRING },
              },
              required: ["original", "replacement", "reasoning"],
            },
          },
        },
        required: ["cohesion", "coverage", "entropy", "sharpness", "explanation", "synthesis", "emergentPatterns", "links", "coverageBreakdown", "synthesisSuggestions"],
      },
    }
  );

  const result = JSON.parse(cleanJsonResponse(response.text || "{}"));
  return {
    cohesion: result.cohesion || 0,
    coverage: result.coverage || 0,
    entropy: result.entropy || 0,
    sharpness: result.sharpness || 0,
    explanation: result.explanation || "Evaluation complete.",
    synthesis: result.synthesis,
    emergentPatterns: result.emergentPatterns || [],
    links: result.links || [],
    coverageBreakdown: result.coverageBreakdown || { dominant: 0, present: 0, edgeCase: 0 },
    synthesisSuggestions: Array.isArray(result.synthesisSuggestions) ? result.synthesisSuggestions : [],
  };
}
