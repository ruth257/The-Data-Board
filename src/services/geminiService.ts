import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { BoardMetrics, Centrality, Scenario, Tile } from "../types";

const getAI = () => {
  const apiKey = 
    process.env.API_KEY || 
    localStorage.getItem("GEMINI_API_KEY") || 
    process.env.DATA_BOARD_KEY || 
    process.env.GEMINI_API_KEY || 
    "";
  return new GoogleGenAI({ apiKey });
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export async function evaluateWord(scenario: Scenario, word: string, existingWords: string[] = []): Promise<Tile> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Evaluate "${word}" for scenario "${scenario.title}".
      SPELLING: Correct typos to professional terms.
      Context: ${scenario.context}
      Outcomes: ${scenario.outcomes.join(", ")}
      Existing: ${existingWords.join(", ")}
      Categories: GREEN (Central), YELLOW (Rare), RED (Misconception).
      Return JSON: correctedWord, centrality, explanation, dataInsight, source, category, isAIConfirmed, relevanceScore.
    `,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correctedWord: { type: Type.STRING },
          centrality: { type: Type.STRING, enum: ["GREEN", "YELLOW", "RED"] },
          explanation: { type: Type.STRING },
          dataInsight: { type: Type.STRING },
          source: { type: Type.STRING },
          category: { type: Type.STRING },
          isAIConfirmed: { type: Type.BOOLEAN },
          relevanceScore: { type: Type.NUMBER },
        },
        required: ["correctedWord", "centrality", "explanation", "dataInsight", "source", "category", "isAIConfirmed", "relevanceScore"],
      },
    },
  });

  const result = JSON.parse(response.text || "{}");
  
  return {
    id: generateId(),
    word: result.correctedWord || word,
    centrality: result.centrality as Centrality,
    explanation: result.explanation,
    dataInsight: result.dataInsight,
    source: result.source,
    category: result.category,
    isAIConfirmed: result.isAIConfirmed,
    relevanceScore: result.relevanceScore,
  };
}

export async function generateBestVocabulary(scenario: Scenario, existingWords: string[] = []): Promise<Tile[]> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Suggest 5-8 relevant vocabulary words for scenario: "${scenario.title}".
      Context: ${scenario.context}
      Outcomes: ${scenario.outcomes.join(", ")}
      Existing: ${existingWords.join(", ")}
      Include GREEN (central) and YELLOW (nuanced) concepts. Avoid RED.
      Return JSON array: word, centrality, explanation, dataInsight, source, category, isAIConfirmed, relevanceScore.
    `,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            centrality: { type: Type.STRING, enum: ["GREEN", "YELLOW", "RED"] },
            explanation: { type: Type.STRING },
            dataInsight: { type: Type.STRING },
            source: { type: Type.STRING },
            category: { type: Type.STRING },
            isAIConfirmed: { type: Type.BOOLEAN },
            relevanceScore: { type: Type.NUMBER },
          },
          required: ["word", "centrality", "explanation", "dataInsight", "source", "category", "isAIConfirmed", "relevanceScore"],
        },
      },
    },
  });

  const results = JSON.parse(response.text || "[]");
  
  return results.map((result: any) => ({
    id: generateId(),
    word: result.word,
    centrality: result.centrality as Centrality,
    explanation: result.explanation,
    dataInsight: result.dataInsight,
    source: result.source,
    category: result.category,
    isAIConfirmed: result.isAIConfirmed,
    relevanceScore: result.relevanceScore,
  }));
}

export async function calculateBoardMetrics(scenario: Scenario, tiles: Tile[]): Promise<BoardMetrics> {
  if (tiles.length === 0) {
    return {
      cohesion: 0,
      coverage: 0,
      entropy: 0,
      explanation: "No data on board to evaluate."
    };
  }

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Evaluate board health for scenario: "${scenario.title}".
      Context: ${scenario.context}
      Vocabulary: ${tiles.map(t => t.word).join(", ")}
      Metrics (0-100): Cohesion, Coverage, Entropy.
      Synthesis: 1-2 sentence non-obvious insight.
      Emergent Patterns: 2-3 short phrases.
      Links: 3-5 objects (source, target, label).
      Return JSON: cohesion, coverage, entropy, explanation, synthesis, emergentPatterns, links.
    `,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cohesion: { type: Type.NUMBER },
          coverage: { type: Type.NUMBER },
          entropy: { type: Type.NUMBER },
          explanation: { type: Type.STRING },
          synthesis: { type: Type.STRING },
          emergentPatterns: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
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
        },
        required: ["cohesion", "coverage", "entropy", "explanation", "synthesis", "emergentPatterns", "links"],
      },
    },
  });

  const result = JSON.parse(response.text || "{}");
  return {
    cohesion: result.cohesion || 0,
    coverage: result.coverage || 0,
    entropy: result.entropy || 0,
    explanation: result.explanation || "Evaluation complete.",
    synthesis: result.synthesis,
    emergentPatterns: result.emergentPatterns,
    links: result.links,
  };
}
