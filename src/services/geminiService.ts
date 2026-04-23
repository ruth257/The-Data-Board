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
    // The platform injects the selected API key into process.env.API_KEY
    const platformKey = typeof process !== 'undefined' ? process.env?.API_KEY : null;
    const activeKey = localKey || platformKey;
    
    // If user has a private key or platform key, use it directly (client-side)
    if (activeKey) {
      console.log(`[Data Board] Using ${localKey ? 'local' : 'platform'} API key.`);
      const ai = new GoogleGenAI({ apiKey: activeKey });
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
      if (response.status === 401) {
        throw new Error("API_KEY_REQUIRED: This action requires an AI connection. Please add your Gemini API key in Settings (The Vault) to continue.");
      }
      
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

        // Add retry info if available
        if (error.retryAfter) {
          errorMessage = `${errorMessage} (RETRY_AFTER:${error.retryAfter})`;
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
      - PSEUDO-ANTONYMS©: Define the narrative foundation by finding opposing categories or variables that define the boundaries of the problem.
      - These handles should be the "Building Blocks" that ground the initial reasoning.
      - FORBIDDEN: Do NOT use abstract analytical handles (e.g., "Logistical Scarcity", "Socio-Economic Stratification", "Friction-Gravity").
      - The 'correctedWord' should be a simple, recognizable term that a human observer would use to describe a segment of data.
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
      Outcomes: ${(scenario.outcomes || []).join(", ")}
      Existing Board: ${existingWords.join(", ")}
      
      Return JSON: correctedWord, centrality, explanation, dataInsight, source, category, specificityScore, logic.
      
      LOGIC MARKUP (A Posteriori Ontology):
      The 'logic' field must be a Mermaid-like structured text block.
      CRITICAL: Every field (tag) MUST start on a new line.
      concept "[word]"
        is a: [norm | benchmark | driver | constraint | lag | grouping | outlier | risk | structural]
        context: "[optional: the specific situational context for this concept]"
        mechanism: "[the causal/structural how]"
        evidence: "[the empirical/data grounding why]"
        covers:
          explains: [variables it explains]
          aggregates: [variables it combines]
          replaces: [statistical term it supersedes]
        relation:
          direction: [upstream | downstream]
          of: "[other concept]"
          via: "[causal mechanism]"
        contrasts_with: "[the pseudo-antonym concept]"
        scope: [global | regional | dataset-specific]
        fidelity: [0.0-1.0]
        fidelity_basis: [semantic_density | expert_judgment | empirical_test]
        valid_when:
          - [condition 1]
          - [condition 2]
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
          specificityScore: { type: Type.NUMBER },
          logic: { type: Type.STRING },
        },
        required: ["correctedWord", "centrality", "explanation", "dataInsight", "source", "category", "specificityScore", "logic"],
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
    specificityScore: result.specificityScore || 50,
    logic: result.logic,
  };
}

export async function generateBestVocabulary(scenario: Scenario, existingWords: string[] = []): Promise<Tile[]> {
  const response = await callAIProxy("gemini-3-flash-preview",
    `
      Suggest "Human Domain Vocabulary" for the subject: "${scenario.title}".
      
      THE HUMAN DOMAIN METHOD:
      - Create a set of 5-8 handles that a human observer or data analyst would first identify as "Facts" or "Segments".
      - Use descriptive segments, demographics, and clear factual categories.
      - SEMANTIC SYNTHESIS: Your primary goal is to find the "Goldilocks" word—precise enough to reduce statistical guessing but flexible enough to enable human narration.
      - PSEUDO-ANTONYMS©: Identify the narrative foundation by finding opposing categories or variables.
      - These handles should be the "Building Blocks" that ground the initial reasoning.
      - FORBIDDEN: Do NOT use "Smartass" analytical handles (e.g., "Logistical Scarcity", "Production-Velocity", "Inertia").
      - Focus on "What" and "Who" before "Why".
      
      THE HANDLE DIRECTIVE:
      - The 'word' MUST be a simple, recognizable handle (1-2 words max).
      - The 'explanation' MUST be the "Sharp Evidence" that grounds this concept in the data.
      
      CENTRALITY CATEGORIES:
      - DOMINANT: A major causal driver (Green).
      - PRESENT: A secondary factor (Yellow).
      - EDGE_CASE: A structural tension point or an outlier (Red).
      
      Context: ${scenario.context}
      Outcomes: ${(scenario.outcomes || []).join(", ")}
      Existing: ${existingWords.join(", ")}
      
      Return JSON array: word, centrality, explanation, dataInsight, source, category, isAIConfirmed, relevanceScore, specificityScore, logic.
      
      LOGIC MARKUP (A Posteriori Ontology):
      The 'logic' field for each tile must be a Mermaid-like structured text block.
      CRITICAL: Every field (tag) MUST start on a new line.
      concept "[word]"
        is a: [norm | benchmark | driver | constraint | lag | grouping | outlier | risk | structural]
        context: "[optional: the specific situational context for this concept]"
        mechanism: "[the causal/structural how]"
        evidence: "[the empirical/data grounding why]"
        covers:
          explains: [variables it explains]
          aggregates: [variables it combines]
          replaces: [statistical term it supersedes]
        relation:
          direction: [upstream | downstream]
          of: "[other concept]"
          via: "[causal mechanism]"
        contrasts_with: "[the pseudo-antonym concept]"
        scope: [global | regional | dataset-specific]
        fidelity: [0.0-1.0]
        fidelity_basis: [semantic_density | expert_judgment | empirical_test]
        valid_when:
          - [condition 1]
          - [condition 2]
      
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
            logic: { type: Type.STRING },
          },
          required: ["word", "centrality", "explanation", "dataInsight", "source", "category", "isAIConfirmed", "relevanceScore", "specificityScore", "logic"],
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
    logic: result.logic,
  }));
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
      
      THE LOGIC BOARD SOURCE CODE (YAML):
      The board is defined by the following A Posteriori Ontology (Logic Board):
      ${tiles.map(t => `concept: "${t.word}"\n${t.logic || `  is_a: ${t.category}\n  mechanism: "${t.explanation}"`}`).join("\n---\n")}
      
      DEDUCTION & SYNTHESIS DIRECTIVE:
      - Use the EXACT "concepts" and "logic" from the board above as the formal grounding for all insights.
      - BRIDGE: Use the "mechanism" and "evidence" fields from the YAML to bridge terms using human-like logical deduction.
      - STRUCTURAL TENSION: Identify "Counter-Forces" or "Tension Pairs" explicitly defined or implied by the "contrasts_with" and "mechanism" fields.
      - EMERGENT PATTERNS: These should be high-level narrative "Handles" that emerge from the interaction of the board's concepts. They MUST be consistent with the logic defined in the YAML.
      - SYNTHESIS: Provide a 1-sentence "Headline Insight" that summarizes the inevitable conclusion using the board's vocabulary.
      
      THE SEMANTIC MAP (Links):
      - Identify 3-6 "Causal Links" between the tiles CURRENTLY ON THE BOARD.
      - CRITICAL: The 'source' and 'target' MUST EXACTLY MATCH the 'concept' names from the list above.
      
      METRICS DEFINITION (0-100):
      - COHESION: How well do these terms connect to form a unified, logical argument based on the provided YAML?
      - COVERAGE: How well does the board cover the breadth of the scenario context?
      - SHARPNESS: How specific and grounded is the evidence for these connections?
      
      Return JSON: cohesion, coverage, entropy, sharpness, explanation, synthesis, emergentPatterns, links, synthesisSuggestions.
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
        required: ["cohesion", "coverage", "entropy", "sharpness", "explanation", "synthesis", "emergentPatterns", "links", "synthesisSuggestions"],
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
    synthesisSuggestions: Array.isArray(result.synthesisSuggestions) ? result.synthesisSuggestions : [],
  };
}

/**
 * Analyzes CSV data to generate a new scenario and initial vocabulary.
 */
export const analyzeCSVData = async (csvSample: string): Promise<{ scenario: Scenario, tiles: Tile[] }> => {
  const response = await callAIProxy("gemini-3-flash-preview",
    `
      Analyze this CSV data sample and generate a "Databoard Scenario" and an initial "Vocabulary Board".
      
      CSV DATA SAMPLE:
      ${csvSample}
      
      INSTRUCTIONS:
      1. Guess the context/scenario of the data. 
      2. Create a Scenario: title, description, context, and two primary opposing outcomes (e.g., ["Success", "Failure"]).
      3. Generate 8-12 initial "Vocabulary Tiles" (handles).
      4. SEMANTIC SYNTHESIS: Your primary goal is to find the "Goldilocks" word—precise enough to reduce statistical guessing but flexible enough to enable human narration.
      5. PSEUDO-ANTONYMS©: Identify the narrative foundation by finding opposing categories or variables.
      6. For each tile, provide a word, centrality (DOMINANT, PRESENT, EDGE_CASE), and a brief explanation/dataInsight.
      
      Return JSON: 
      {
        "scenario": { "title": "...", "description": "...", "context": "...", "outcomes": ["...", "..."] },
        "tiles": [ { "word": "...", "centrality": "DOMINANT|PRESENT|EDGE_CASE", "explanation": "...", "dataInsight": "...", "category": "...", "logic": "..." } ]
      }
      
      LOGIC MARKUP (A Posteriori Ontology):
      The 'logic' field for each tile must be a Mermaid-like structured text block.
      CRITICAL: Every field (tag) MUST start on a new line.
      concept "[word]"
        is a: [norm | benchmark | driver | constraint | lag | grouping | outlier | risk | structural]
        context: "[optional: the specific situational context for this concept]"
        mechanism: "[the causal/structural how]"
        evidence: "[the empirical/data grounding why]"
        covers:
          explains: [variables it explains]
          aggregates: [variables it combines]
          replaces: [statistical term it supersedes]
        relation:
          direction: [upstream | downstream]
          of: "[other concept]"
          via: "[causal mechanism]"
        contrasts_with: "[the pseudo-antonym concept]"
        scope: [global | regional | dataset-specific]
        fidelity: [0.0-1.0]
        fidelity_basis: [semantic_density | expert_judgment | empirical_test]
        valid_when:
          - [condition 1]
          - [condition 2]
    `,
    {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scenario: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              context: { type: Type.STRING },
              outcomes: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "description", "context", "outcomes"]
          },
          tiles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                centrality: { type: Type.STRING, enum: ["DOMINANT", "PRESENT", "EDGE_CASE"] },
                explanation: { type: Type.STRING },
                dataInsight: { type: Type.STRING },
                category: { type: Type.STRING },
                logic: { type: Type.STRING }
              },
              required: ["word", "centrality", "explanation", "dataInsight", "category", "logic"]
            }
          }
        },
        required: ["scenario", "tiles"]
      }
    }
  );

  const result = JSON.parse(cleanJsonResponse(response.text || "{}"));
  
  const scenario: Scenario = {
    id: `custom-${Date.now()}`,
    title: result.scenario.title,
    description: result.scenario.description,
    context: result.scenario.context,
    outcomes: result.scenario.outcomes || ["Outcome A", "Outcome B"]
  };

  const tiles: Tile[] = (result.tiles || []).map((t: any, i: number) => ({
    id: `tile-${Date.now()}-${i}`,
    ...t
  }));

  return { scenario, tiles };
};
