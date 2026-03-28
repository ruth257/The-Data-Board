import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { BoardMetrics, EvidenceImpact, Scenario, Tile } from "../types";

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
      Evaluate the vocabulary word "${word}" for scenario "${scenario.title}".
      
      THE HANDLE DIRECTIVE:
      - The 'correctedWord' MUST be a punchy "Handle" (1-3 words max). 
      - Example: If user types "Skip Rate", keep it as "Skip Rate" or "High Skip Rate".
      
      THE EVIDENCE DIRECTIVE (The "Sharp Finding"):
      - The 'explanation' MUST be a specific, data-backed observation that grounds this word in the dataset.
      - Use "Pseudo-Antonyms" internally to find the sharpest contrast.
      - Example: For "Skip Rate", the evidence might be "40% spike in skips during 30s+ intros for Gen Z."
      
      IMPACT CATEGORIES:
      - DRIVER: A force pushing towards a positive outcome.
      - FRICTION: A barrier or negative force.
      - CONTEXT: Background data that provides necessary framing.
      
      Context: ${scenario.context}
      Outcomes: ${scenario.outcomes.join(", ")}
      Existing Findings: ${existingWords.join(", ")}
      
      Return JSON: correctedWord (The Handle), impact (DRIVER/FRICTION/CONTEXT), explanation (The Sharp Evidence), dataInsight, source, category, isAIConfirmed, relevanceScore, specificityScore.
    `,
    {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correctedWord: { type: Type.STRING },
          impact: { type: Type.STRING, enum: ["DRIVER", "FRICTION", "CONTEXT"] },
          explanation: { type: Type.STRING },
          dataInsight: { type: Type.STRING },
          source: { type: Type.STRING },
          category: { type: Type.STRING },
          isAIConfirmed: { type: Type.BOOLEAN },
          relevanceScore: { type: Type.NUMBER },
          specificityScore: { type: Type.NUMBER },
        },
        required: ["correctedWord", "impact", "explanation", "dataInsight", "source", "category", "isAIConfirmed", "relevanceScore", "specificityScore"],
      },
    }
  );

  const result = JSON.parse(cleanJsonResponse(response.text || "{}"));
  
  return {
    id: generateId(),
    word: result.correctedWord || word,
    impact: result.impact as EvidenceImpact,
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
      Suggest 5-8 "Handles" (Vocabulary Words) for scenario: "${scenario.title}".
      
      THE EXPERT METHOD (Pseudo-Antonyms):
      - Brainstorm categories that create order in the problem space.
      - Use "Pseudo-Antonyms" (contextual opposites) to define boundaries.
      - Example: If you suggest "Jazz", also suggest "Non-English" if they represent a behavioral split.
      - Example: "Traveler" vs "Mom" as customer personas.
      
      THE HANDLE DIRECTIVE:
      - The 'word' MUST be a punchy handle (1-3 words max).
      - The 'explanation' MUST be the "Sharp Evidence" supporting that handle.
      
      Context: ${scenario.context}
      Outcomes: ${scenario.outcomes.join(", ")}
      Existing: ${existingWords.join(", ")}
      
      Return JSON array: word (The Handle), impact (DRIVER/FRICTION/CONTEXT), explanation (The Sharp Evidence), dataInsight, source, category, isAIConfirmed, relevanceScore, specificityScore.
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
            impact: { type: Type.STRING, enum: ["DRIVER", "FRICTION", "CONTEXT"] },
            explanation: { type: Type.STRING },
            dataInsight: { type: Type.STRING },
            source: { type: Type.STRING },
            category: { type: Type.STRING },
            isAIConfirmed: { type: Type.BOOLEAN },
            relevanceScore: { type: Type.NUMBER },
            specificityScore: { type: Type.NUMBER },
          },
          required: ["word", "impact", "explanation", "dataInsight", "source", "category", "isAIConfirmed", "relevanceScore", "specificityScore"],
        },
      },
    }
  );

  const results = JSON.parse(cleanJsonResponse(response.text || "[]"));
  
  return (Array.isArray(results) ? results : []).map((result: any) => ({
    id: generateId(),
    word: result.word || "Unknown",
    impact: (result.impact as EvidenceImpact) || EvidenceImpact.CONTEXT,
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
      - COVERAGE: Do we have a balance of DRIVERS, FRICTIONS, and CONTEXT?
      - SHARPNESS: Average specificity of the evidence backing these handles.
      
      SYNTHESIS (The Eureka Moment): 
      - Provide a 1-sentence "Headline Insight" that summarizes the inevitable conclusion.
      - The insight should feel like it was "found" by looking at the handles above.
      
      Return JSON: cohesion, coverage, entropy, sharpness, explanation, synthesis, emergentPatterns, links, coverageBreakdown, synthesisSuggestions.
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
              demographics: { type: Type.NUMBER },
              behaviors: { type: Type.NUMBER },
              drivers: { type: Type.NUMBER },
            },
            required: ["demographics", "behaviors", "drivers"],
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
    coverageBreakdown: result.coverageBreakdown || { demographics: 0, behaviors: 0, drivers: 0 },
    synthesisSuggestions: Array.isArray(result.synthesisSuggestions) ? result.synthesisSuggestions : [],
  };
}
