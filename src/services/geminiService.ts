import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { BoardMetrics, Centrality, NarrativeThread, Scenario, Tile } from "../types";

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

export async function evaluateWord(scenario: Scenario, word: string, existingWords: string[] = [], datasetSample?: string): Promise<Tile> {
  const groundingBlock = datasetSample
    ? `
      THE DATASET (this is real data you must check against — not a description of it):
      ${datasetSample}

      GROUNDING RULE — READ THIS FIRST:
      - "dataInsight" MUST cite specific values, rows, or a specific comparison found in THE DATASET above. Quote or closely paraphrase the actual numbers/categories you're pointing at.
      - Set "evidenceGrounded" to true only if you actually did this. If the dataset above does not support this concept, set "evidenceGrounded" to false and say in "dataInsight" what's missing — do not invent a plausible-sounding number.
    `
    : `
      GROUNDING RULE — READ THIS FIRST:
      - No dataset sample was provided for this scenario — you only have the text context below, not real rows to check.
      - Set "evidenceGrounded" to false. "dataInsight" must be prefixed with "General domain knowledge (not data-verified): " and should draw on well-established facts about this domain, not an invented statistic.
    `;

  const response = await callAIProxy("gemini-3-flash-preview",
    `
      Evaluate the handle "${word}" for the subject: "${scenario.title}".

      THE HUMAN DOMAIN DIRECTIVE:
      - PARADIGM GENERATOR MODE: You are an AUDITOR, not a describer. Do NOT simply re-label the column headers from the data.
      - GOLDILOCKS NAMING CUTS BOTH WAYS: precise enough to be grounded, general enough to reason from. A synthesized name (e.g. "Resource Elasticity" instead of "Income") only earns its place when the literal term would flatten a real mechanism. If the literal, closer-to-the-data term is already the clearest handle, KEEP IT — do not invent a more abstract label just to sound more analytical. Jargon that explains nothing new is worse than the plain term it replaced.
      - PSEUDO-ANTONYMS ARE CONDITIONAL, NOT MANDATORY: only identify a structural opposite ("contrasts_with") if a genuine one already exists in this domain — something a domain expert would recognize as the real other side of a real tension. Many valid concepts are foundational or descriptive and have no natural opposite (e.g. "Healthy Life Expectancy" is not in tension with anything specific). For those, leave "contrasts_with" out entirely rather than inventing one. A pseudo-antonym exists to test whether the concept represents a real fault line in the whole dataset, not a single direction in it — forcing one onto every concept defeats that purpose.

      THE EVIDENCE COHERENCE DIRECTIVE:
      - The 'explanation' MUST be a specific, data-grounded observation that provides "Sharp Evidence".
      - Ensure the handle is globally coherent within the reasoning space of the scenario.
      ${groundingBlock}
      CENTRALITY CATEGORIES:
      - DOMINANT: A major causal driver (Green).
      - PRESENT: A secondary factor (Yellow).
      - EDGE_CASE: A structural tension point or a false assumption (Red).

      Context: ${scenario.context}
      Outcomes: ${(scenario.outcomes || []).join(", ")}
      Existing Board: ${existingWords.join(", ")}

      Return JSON: correctedWord, centrality, explanation, dataInsight, evidenceGrounded, source, category, specificityScore, fidelity, logic.

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
        contrasts_with: "[OPTIONAL — only if a genuine structural opposite exists in this domain; omit the line entirely otherwise]"
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
          evidenceGrounded: { type: Type.BOOLEAN },
          source: { type: Type.STRING },
          category: { type: Type.STRING },
          specificityScore: { type: Type.NUMBER },
          fidelity: { type: Type.NUMBER },
          logic: { type: Type.STRING },
        },
        required: ["correctedWord", "centrality", "explanation", "dataInsight", "evidenceGrounded", "source", "category", "specificityScore", "fidelity", "logic"],
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
    evidenceGrounded: result.evidenceGrounded ?? false,
    source: result.source || "General Knowledge",
    category: result.category || "General",
    specificityScore: result.specificityScore || 50,
    fidelity: result.fidelity || 0.85,
    logic: result.logic,
  };
}

export async function generateBestVocabulary(scenario: Scenario, existingWords: string[] = [], datasetSample?: string): Promise<Tile[]> {
  const groundingBlock = datasetSample
    ? `
      THE DATASET (this is real data you must check against — not a description of it):
      ${datasetSample}

      GROUNDING RULE — READ THIS FIRST:
      - For every tile, "dataInsight" MUST cite specific values, rows, or a specific comparison found in THE DATASET above. Quote or closely paraphrase the actual numbers/categories you're pointing at — do not describe a plausible-sounding trend you didn't check.
      - Set "evidenceGrounded" to true only for tiles where you actually did this. If a candidate concept isn't supported by the dataset above, either drop it or set "evidenceGrounded" to false and say in "dataInsight" what's missing.
    `
    : `
      GROUNDING RULE — READ THIS FIRST:
      - No dataset sample was provided for this scenario — you only have the text context below, not real rows to check.
      - Set "evidenceGrounded" to false for every tile. Each "dataInsight" must be prefixed with "General domain knowledge (not data-verified): " and draw on well-established facts about this domain, not an invented statistic.
    `;

  const response = await callAIProxy("gemini-3-flash-preview",
    `
      Suggest "Human Domain Vocabulary" for the subject: "${scenario.title}".

      THE HUMAN DOMAIN METHOD:
      - PARADIGM GENERATOR MODE: You are the AUDITOR. Stop "guessing" meaning and start "verifying" it against the evidence.
      - GOLDILOCKS NAMING CUTS BOTH WAYS: search for the clearest handle for the structural truth in the data — sometimes that's a synthesized term, sometimes the plain descriptive term is already exact and inventing a fancier one would only add jargon. Prefer the plainest name that still captures the mechanism.
      - PSEUDO-ANTONYMS ARE CONDITIONAL, NOT MANDATORY: across the whole board, expect only a small number of genuine tension pairs (often just one or two) — pairs that represent a real fault line running through the WHOLE dataset, not a single direction in it. Most concepts on a board are foundational or descriptive and correctly have no pseudo-antonym. Do not force every handle into a tug-of-war; only pair concepts when a domain expert would recognize the opposition as real.
      - SEMANTIC SYNTHESIS: Your primary goal is to find handles that are true to the "Mechanism" of the data. A literal label is fine when it already is the mechanism (e.g. "Healthy Life Expectancy" needs no synthesis); reach for a synthesized name only when the literal label would flatten something real (e.g. "Income" alone hides the distinction between raw wealth and the freedom it buys — "Resource Elasticity" earns its keep there).
      - Use descriptive segments and clear factual categories that ground the initial reasoning.

      THE HANDLE DIRECTIVE:
      - The 'word' MUST be a simple, recognizable handle (1-2 words max).
      - The 'explanation' MUST be the "Sharp Evidence" that grounds this concept in the data.
      ${groundingBlock}
      CENTRALITY CATEGORIES:
      - DOMINANT: A major causal driver (Green).
      - PRESENT: A secondary factor (Yellow).
      - EDGE_CASE: A structural tension point or an outlier (Red).

      Context: ${scenario.context}
      Outcomes: ${(scenario.outcomes || []).join(", ")}
      Existing: ${existingWords.join(", ")}

      Return JSON array: word, centrality, explanation, dataInsight, evidenceGrounded, source, category, isAIConfirmed, relevanceScore, specificityScore, fidelity, logic.

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
        contrasts_with: "[OPTIONAL — only if a genuine structural opposite exists in this domain; omit the line entirely otherwise]"
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
            evidenceGrounded: { type: Type.BOOLEAN },
            source: { type: Type.STRING },
            category: { type: Type.STRING },
            isAIConfirmed: { type: Type.BOOLEAN },
            relevanceScore: { type: Type.NUMBER },
            specificityScore: { type: Type.NUMBER },
            fidelity: { type: Type.NUMBER },
            logic: { type: Type.STRING },
          },
          required: ["word", "centrality", "explanation", "dataInsight", "evidenceGrounded", "source", "category", "isAIConfirmed", "relevanceScore", "specificityScore", "fidelity", "logic"],
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
    evidenceGrounded: result.evidenceGrounded ?? false,
    source: result.source || "General Knowledge",
    category: result.category || "General",
    isAIConfirmed: result.isAIConfirmed ?? true,
    relevanceScore: result.relevanceScore || 50,
    specificityScore: result.specificityScore || 50,
    fidelity: result.fidelity || 0.85,
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
      - STRUCTURAL TENSION: Identify "Counter-Forces" or "Tension Pairs" explicitly defined by the "contrasts_with" fields. Do not invent tension pairs beyond what the board's concepts actually declare — most boards will only have one or two genuine pairs, and that is expected, not a gap to fill.
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
      1. AUDIT THE TENSION: Do not simply re-state column names. Identify the underlying "Audit Narrative" the data suggests.
      2. Create a Scenario: title, description, context, and two primary opposing outcomes (e.g., ["Structural Stability", "Systemic Collapse"]).
      3. Generate 8-12 Vocabulary Tiles (handles).
      4. GOLDILOCKS NAMING CUTS BOTH WAYS: reach for a synthesized "Mechanism" name only when the literal column/field name would flatten something real (e.g., "Social Support" → "Communal Safety Net" earns its keep because it names the buffering mechanism). If the literal term is already the clearest handle, keep it — do not manufacture jargon for its own sake.
      5. PSEUDO-ANTONYMS ARE CONDITIONAL: across the WHOLE 8-12 tile board, expect only a small number of genuine tension pairs (typically 1-2) that represent a real structural fault line running through the whole dataset — not a single direction in it. Most tiles should have no pseudo-antonym at all. Only pair concepts when a domain expert would recognize the opposition as real; do not force a tug-of-war onto every concept.
      6. For each tile, provide a word, centrality, and a brief explanation/dataInsight based on evidence.
      7. GROUNDING RULE: "dataInsight" MUST cite specific values, rows, or a specific comparison you can actually see in the CSV DATA SAMPLE above — quote or closely paraphrase the real numbers/categories, don't describe a plausible-sounding trend you didn't check. Set "evidenceGrounded" to true only when you did this; if a candidate concept isn't really supported by the sample, either drop it or set "evidenceGrounded" to false and say what's missing in "dataInsight".

      Return JSON:
      {
        "scenario": { "title": "...", "description": "...", "context": "...", "outcomes": ["...", "..."] },
        "tiles": [ { "word": "...", "centrality": "DOMINANT|PRESENT|EDGE_CASE", "explanation": "...", "dataInsight": "...", "evidenceGrounded": true, "category": "...", "fidelity": "0.0-1.0", "logic": "..." } ]
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
        contrasts_with: "[OPTIONAL — only if a genuine structural opposite exists in this domain; omit the line entirely otherwise]"
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
                evidenceGrounded: { type: Type.BOOLEAN },
                category: { type: Type.STRING },
                fidelity: { type: Type.NUMBER },
                logic: { type: Type.STRING }
              },
              required: ["word", "centrality", "explanation", "dataInsight", "evidenceGrounded", "category", "fidelity", "logic"]
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

const generateThreadId = () => `thread-${generateId()}`;

/**
 * Groups the board's concepts into narrative threads: which concepts, taken
 * together, actually carry a single coherent story. Independent of the
 * Dominant/Present/Edge-Case layout, and independent of pseudo-antonym pairs
 * (a thread is not a tension pair — it's a set of concepts that co-explain
 * one outcome). A concept may belong to more than one thread if it genuinely
 * supports more than one story.
 */
export async function clusterIntoThreads(scenario: Scenario, tiles: Tile[]): Promise<NarrativeThread[]> {
  if (!Array.isArray(tiles) || tiles.length < 2) return [];

  const response = await callAIProxy("gemini-3-flash-preview",
    `
      Group the concepts on this board into narrative threads for scenario: "${scenario.title}".

      A "narrative thread" is a subset of the concepts below that, together, explain ONE coherent
      story about the data — not every concept on the board belongs to the same story.

      THE CONCEPTS ON THE BOARD:
      ${tiles.map(t => `- "${t.word}" (${t.centrality}): ${t.explanation}`).join("\n")}

      INSTRUCTIONS:
      - Propose 2-3 threads. Each thread needs at least 2 concepts.
      - A concept CAN appear in more than one thread if it genuinely supports more than one story.
      - Do NOT force every concept into a thread — a concept with no real narrative partner can be left out.
      - For each thread, give it a short title (3-6 words) naming the story, list which concept words
        belong to it (must exactly match the words above), and write a 1-sentence synthesis of the story
        using only those concepts.
      - Every thread you propose should already cohere as one story — that's what makes it a thread.

      Context: ${scenario.context}

      Return JSON array: title, conceptWords, synthesis.
    `,
    {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            conceptWords: { type: Type.ARRAY, items: { type: Type.STRING } },
            synthesis: { type: Type.STRING },
          },
          required: ["title", "conceptWords", "synthesis"],
        },
      },
    }
  );

  let results: any[];
  try {
    results = JSON.parse(cleanJsonResponse(response.text || "[]"));
  } catch (e) {
    console.error("Failed to parse thread clustering response:", e);
    results = [];
  }

  return (Array.isArray(results) ? results : []).map((r: any) => ({
    id: generateThreadId(),
    title: r.title || "Untitled Thread",
    conceptWords: Array.isArray(r.conceptWords) ? r.conceptWords : [],
    synthesis: r.synthesis || "",
    coheres: "yes" as const,
  }));
}

/**
 * Re-checks whether a specific, user-edited set of concepts actually coheres
 * into one story. Used after a user drags a concept into or out of a thread.
 * Unlike clusterIntoThreads, this does not invent membership — it audits the
 * membership it's given, and says so honestly when it doesn't hold together.
 */
export async function synthesizeThread(
  scenario: Scenario,
  conceptWords: string[],
  tiles: Tile[]
): Promise<{ coheres: "yes" | "partial" | "no"; synthesis: string; missingLink?: string }> {
  const relevantTiles = tiles.filter(t => conceptWords.includes(t.word));
  if (relevantTiles.length < 2) {
    return { coheres: "no", synthesis: "", missingLink: "A thread needs at least 2 concepts to test for a shared story." };
  }

  const response = await callAIProxy("gemini-3-flash-preview",
    `
      Audit whether this specific set of concepts coheres into ONE story for scenario: "${scenario.title}".

      THE CONCEPTS IN THIS THREAD:
      ${relevantTiles.map(t => `- "${t.word}" (${t.centrality}): ${t.explanation}`).join("\n")}

      INSTRUCTIONS:
      - Do NOT invent a connection that isn't there. You are auditing this exact membership, not
        proposing your own grouping.
      - "yes": all concepts clearly co-explain one outcome. Write the 1-sentence synthesis.
      - "partial": most concepts fit but one is a stretch, or the story is thin. Write the synthesis
        anyway, and name what's missing in missingLink.
      - "no": these concepts don't actually share a story. Leave synthesis short/empty and explain
        what's missing in missingLink instead.

      Context: ${scenario.context}

      Return JSON: coheres ("yes"|"partial"|"no"), synthesis, missingLink.
    `,
    {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          coheres: { type: Type.STRING, enum: ["yes", "partial", "no"] },
          synthesis: { type: Type.STRING },
          missingLink: { type: Type.STRING },
        },
        required: ["coheres", "synthesis"],
      },
    }
  );

  const result = JSON.parse(cleanJsonResponse(response.text || "{}"));
  return {
    coheres: (result.coheres as "yes" | "partial" | "no") || "partial",
    synthesis: result.synthesis || "",
    missingLink: result.missingLink,
  };
}
