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
      
      SCIENTIFIC GROUNDING: Use your internal scientific, historical, and academic knowledge base to provide specific data and insights. Do not rely solely on the provided context.
      
      SPELLING/CORRECTION: 
      - If "${word}" is a typo (e.g., "gnder"), correct it to the most likely intended term (e.g., "Gender"). 
      - PRESERVE SIMPLICITY: Do NOT change foundational variables (like "Gender", "Seniors", "Gen Z", "Female") into complex academic terms. Keep them simple and direct.
      - Do NOT change the word if it is already a valid term.
      
      RELEVANCE: If the concept is completely irrelevant to the scenario, mark it as RED with a low relevanceScore.
      
      INSIGHT DIRECTIVE: The board is a tool for synthesis. Your explanation and dataInsight should help the user draw "inevitable" conclusions by connecting this word to the broader scenario and existing vocabulary.
      
      Context: ${scenario.context}
      Outcomes: ${scenario.outcomes.join(", ")}
      Existing: ${existingWords.join(", ")}
      Categories: GREEN (Central), YELLOW (Rare), RED (Misconception/Irrelevant).
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
      
      FULL COVERAGE DIRECTIVE: Ensure the vocabulary covers multiple dimensions of the topic:
      - DEMOGRAPHICS: Who is impacted? (e.g., "Gen Z", "Gender", "Seniors", "Socioeconomic Status").
      - BEHAVIORS/VARIABLES: What are the specific actions or data points? (e.g., "Screen Time", "Dopamine Loops").
      - DRIVERS/WHY: What are the underlying causes? (e.g., "Algorithmic Amplification").
      - IMPACT: What are the specific outcomes?
      
      SCIENTIFIC GROUNDING: Prioritize foundational variables supported by real-world data and research. Avoid "theory-heavy" name dropping unless it is a primary data variable.
      
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
      
      METRICS DEFINITION (0-100):
      - COHESION: How well do the concepts connect to form a unified narrative?
      - COVERAGE: Does the board include a balance of DEMOGRAPHICS (who), BEHAVIORS (what), and DRIVERS (why)?
      - ENTROPY: How much diversity and non-obvious data is present?
      
      COVERAGE BREAKDOWN (0-100):
      - DEMOGRAPHICS: Presence of foundational variables like age, gender, location, or social class.
      - BEHAVIORS: Presence of specific actions, habits, or observable phenomena.
      - DRIVERS: Presence of underlying motivations, causes, or systemic forces.
      
      Synthesis: 1-2 sentence non-obvious insight.
      Emergent Patterns: 2-3 short phrases.
      Links: 3-5 objects (source, target, label).
      
      SYNTHESIS SUGGESTIONS: Identify if multiple existing words can be replaced by a single, higher-level abstraction (e.g., "USA, UK, Canada" -> "English Speaking Countries"). 
      Return an array of objects: original (array of words), replacement (the abstraction), reasoning (why this clarifies the board).
      
      Return JSON: cohesion, coverage, entropy, explanation, synthesis, emergentPatterns, links, coverageBreakdown, synthesisSuggestions.
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
        required: ["cohesion", "coverage", "entropy", "explanation", "synthesis", "emergentPatterns", "links", "coverageBreakdown", "synthesisSuggestions"],
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
    coverageBreakdown: result.coverageBreakdown,
    synthesisSuggestions: result.synthesisSuggestions,
  };
}
