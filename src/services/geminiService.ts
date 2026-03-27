import { GoogleGenAI, Type } from "@google/genai";
import { BoardMetrics, Centrality, Scenario, Tile } from "../types";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function evaluateWord(scenario: Scenario, word: string, existingWords: string[] = []): Promise<Tile> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Evaluate the concept "${word}" in the context of "${scenario.title}" (${scenario.description}).
      
      SPELLING CORRECTION: If the concept "${word}" is misspelled or has a clear typo, correct it to the most likely intended professional/academic term.
      
      Context: ${scenario.context}
      Outcomes: ${scenario.outcomes.join(", ")}
      Existing Board Vocabulary: ${existingWords.join(", ")}

      Based on the "Data Board" method:
      - GREEN: Dominant/Central to the outcome. High semantic density in data and literature.
      - YELLOW: Present but rare or not decisive.
      - RED: Edge case, not grounded in data, or a common assumption that isn't supported.

      RELEVANCE SCORE CALCULATION (Transparency Directive):
      - Scenario Alignment (50%): Direct correlation with outcomes.
      - Evidence Strength (30%): Quality of historical/scientific source.
      - Semantic Uniqueness (20%): How much new information it adds compared to the existing board.

      Return a JSON object with:
      - correctedWord: The corrected version of the word (or the original if correct).
      - centrality: "GREEN", "YELLOW", or "RED"
      - explanation: A short (1-2 sentence) explanation of why it fits this category.
      - dataInsight: A specific data-driven insight (e.g., "78% of 3rd class passengers perished").
      - source: A credible source or historical reference (e.g., "British Wreck Commissioner's Inquiry").
      - category: A one-word category for this concept (e.g., "Social", "Physical", "Economic").
      - isAIConfirmed: true if this is a particularly strong or surprising insight (the ★ mark).
      - relevanceScore: A number from 0-100 representing how central this is to the data.
    `,
    config: {
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
    id: Math.random().toString(36).substr(2, 9),
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
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Based on the "Data Board" method, suggest 5-8 highly relevant or insightful vocabulary words/phrases for the scenario: "${scenario.title}".
      Context: ${scenario.context}
      Outcomes: ${scenario.outcomes.join(", ")}
      Existing Board Vocabulary: ${existingWords.join(", ")}

      The vocabulary should include:
      - Some "GREEN" (Dominant/Central) concepts that are deeply grounded in the data.
      - Some "YELLOW" (Present but rare) concepts that offer a nuanced perspective.
      - Avoid "RED" unless they are common misconceptions worth highlighting.
      - COHESION: Ensure new suggestions complement the existing board without being redundant.

      Return a JSON array of objects, each with:
      - word: The concept.
      - centrality: "GREEN", "YELLOW", or "RED".
      - explanation: A short (1-2 sentence) explanation.
      - dataInsight: A specific data-driven insight.
      - source: A credible source or historical reference.
      - category: A one-word category.
      - isAIConfirmed: true if it's a particularly strong insight.
      - relevanceScore: A number from 0-100.
    `,
    config: {
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
    id: Math.random().toString(36).substr(2, 9),
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

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Evaluate the overall health and cohesion of the current "Data Board" vocabulary for the scenario: "${scenario.title}".
      Context: ${scenario.context}
      Current Board Vocabulary: ${tiles.map(t => t.word).join(", ")}

      Calculate the following metrics (0-100):
      - Cohesion: How well the words relate to each other within a unified narrative or semantic domain.
      - Coverage: How much of the scenario's outcomes and context are addressed by this vocabulary.
      - Entropy: The diversity of concepts. High entropy means a broad range of categories; low entropy means a narrow focus.

      Also, generate:
      - Synthesis: A 1-2 sentence "Original Insight" that connects these specific words in a non-obvious way. CHALLENGE THE PARROT: Avoid common clichés. Find a counter-intuitive or emergent relationship.
      - Emergent Patterns: An array of 2-3 short phrases describing non-obvious connections between specific words on the board.
      - Links: An array of 3-5 objects connecting specific words on the board. Each object should have:
        - source: The 'word' of the first tile.
        - target: The 'word' of the second tile.
        - label: A 1-2 word description of the relationship (e.g., "Drives", "Opposes", "Enables").

      Return a JSON object with:
      - cohesion: number
      - coverage: number
      - entropy: number
      - explanation: A short (1-2 sentence) summary of the board's state.
      - synthesis: string
      - emergentPatterns: array of strings
      - links: array of objects with source, target, and label
    `,
    config: {
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
