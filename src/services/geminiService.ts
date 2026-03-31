import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { BoardMetrics, Centrality, Scenario, Tile } from "../types";

const callAIProxy = async (model: string, contents: any, config: any) => {
  const localKey = localStorage.getItem("GEMINI_API_KEY");
  
  // If user has a private key in localStorage, use it directly (client-side)
  if (localKey) {
    const ai = new GoogleGenAI({ apiKey: localKey });
    return await ai.models.generateContent({ model, contents, config });
  }

  // Otherwise, use the shared server-side proxy
  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, contents, config }),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const error = await response.json();
      throw new Error(error.error || "AI request failed");
    } else {
      const text = await response.text();
      console.error("Server returned non-JSON error:", text);
      throw new Error(`Server error (${response.status}). Please check server logs.`);
    }
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Server returned non-JSON response:", text);
    throw new Error("Invalid response from server. Expected JSON.");
  }

  return await response.json();
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
      Evaluate the descriptive handle "${word}" for the subject: "${scenario.title}".
      
      THE BRIDGE DIRECTIVE:
      - Bridge raw facts with a sharp semantic deduction.
      - The 'correctedWord' MUST be a punchy "Descriptive Handle" (1-3 words max). 
      - Prioritize segments, adjectives, or drivers (e.g., "Female", "Weekends", "Impulsive", "Mobile-First").
      - Include high-level concepts or theories (e.g., "Global South", "Paradox of Choice") ONLY if they are semantically cohesive and essential for a complete analysis of the subject.
      - AVOID technical metric names (like "CTR") unless they are the primary finding.
      
      THE EVIDENCE DIRECTIVE (The "Sharp Finding"):
      - The 'explanation' MUST be a specific, data-grounded observation.
      - Ground the handle in actual data distributions or behavioral patterns.
      
      CENTRALITY CATEGORIES:
      - DOMINANT: A major driver or the bulk of the data (Green).
      - PRESENT: A secondary but real factor (Yellow).
      - EDGE_CASE: An outlier, a rare segment, or a common assumption that is actually false (Red).
      
      Context: ${scenario.context}
      Outcomes: ${scenario.outcomes.join(", ")}
      Existing Board: ${existingWords.join(", ")}
      
      Return JSON: correctedWord (The Handle), centrality (DOMINANT/PRESENT/EDGE_CASE), explanation (The Sharp Evidence), dataInsight, source, category, isAIConfirmed, relevanceScore, specificityScore.
    `,
    {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
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
      Suggest 5-8 "Analytical Handles" (Vocabulary) for the subject: "${scenario.title}".
      
      THE ANALYSIS METHOD:
      - Identify the most descriptive segments, adjectives, or drivers revealed by the data.
      - Use "Pseudo-Antonyms" to define semantic boundaries (e.g., "Mobile-First" vs "Desktop-Legacy").
      - Focus on vocabulary that is useful for *discussing* and *analyzing* the reality of the subject.
      - Prioritize descriptive findings, but include high-level concepts or theories (e.g., "Global South", "Paradox of Choice") if they are semantically cohesive and required for the board to be complete.
      
      THE HANDLE DIRECTIVE:
      - The 'word' MUST be a punchy descriptive handle (1-3 words max).
      - The 'explanation' MUST be the "Sharp Evidence" or "Data Grounding" for that handle.
      
      CENTRALITY CATEGORIES:
      - DOMINANT: A major driver or the bulk of the data (Green).
      - PRESENT: A secondary but real factor (Yellow).
      - EDGE_CASE: An outlier, a rare segment, or a common assumption that is actually false (Red).
      
      Context: ${scenario.context}
      Outcomes: ${scenario.outcomes.join(", ")}
      Existing: ${existingWords.join(", ")}
      
      Return JSON array: word (The Handle), centrality (DOMINANT/PRESENT/EDGE_CASE), explanation (The Sharp Evidence), dataInsight, source, category, isAIConfirmed, relevanceScore, specificityScore.
    `,
    {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
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

  const results = JSON.parse(cleanJsonResponse(response.text || "[]"));
  
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

export async function calculateBoardMetrics(scenario: Scenario, tiles: Tile[]): Promise<BoardMetrics> {
  if (tiles.length === 0) {
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
      
      THE BOARD:
      ${tiles.map(t => `- [${t.word}]: ${t.explanation}`).join("\n")}
      
      METRICS DEFINITION (0-100):
      - COHESION: How well do these specific handles connect to form a unified argument?
      - COVERAGE: Do we have a balance of DOMINANT, PRESENT, and EDGE_CASE handles?
      - SHARPNESS: Average specificity of the evidence backing these handles.
      
      SYNTHESIS (The Eureka Moment): 
      - Provide a 1-sentence "Headline Insight" that summarizes the inevitable conclusion.
      - The insight should feel like it was "found" by looking at the handles above.
      
      Return JSON: cohesion, coverage, entropy, sharpness, explanation, synthesis, emergentPatterns, links, coverageBreakdown (dominant, present, edgeCase), synthesisSuggestions.
    `,
    {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
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
