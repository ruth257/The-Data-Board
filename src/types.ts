declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export enum Centrality {
  DOMINANT = "DOMINANT", // Green: Central/Major driver
  PRESENT = "PRESENT",   // Yellow: Present/Secondary
  EDGE_CASE = "EDGE_CASE", // Red: Outlier/Assumption
}

export interface Tile {
  id: string;
  word: string; // The "Handle" (Descriptive finding, segment, or adjective)
  centrality: Centrality;
  explanation: string; // The "Sharp Evidence" or "Grounding Observation"
  dataInsight?: string; // Specific data distribution or pattern
  evidenceGrounded?: boolean; // true only if dataInsight cites a real dataset sample the AI was given, not general domain knowledge
  source?: string; // Historical or scientific source
  category?: string;
  isAIConfirmed?: boolean;
  logic?: string; // The "A Posteriori Ontology" markup (Mermaid-like code)
  cachedShadow?: Tile; // Pre-generated causal audit (shadow tile)
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  context: string; // Detailed context for the AI
  outcomes: string[]; // e.g., ["Survival", "Death"]
  url?: string; // Optional URL for the scenario source
}

export interface NarrativeThread {
  id: string;
  title: string; // short label for the story this thread tells, e.g. "The price-gap story"
  conceptWords: string[]; // words of the tiles currently in this thread
  synthesis: string; // 1-sentence narrative using only this thread's concepts
  coheres: "yes" | "partial" | "no"; // does the current membership actually hold together as one story
  missingLink?: string; // if not fully coherent, what's missing to make it one
  isResidual?: boolean; // true only for the one special "Unaddressed" entry — not a concept cluster, the Completeness Check naming what the board's accepted concepts don't explain
}

export interface BoardMetrics {
  explanation: string;
  synthesis?: string; // The "Headline Insight" / Eureka Moment
  emergentPatterns?: string[];
  // Legacy fields from earlier cached boards. No longer requested from the AI
  // (they were invented scores with nothing behind them) and no longer
  // rendered — kept optional here only so old CACHED_BOARDS data still typechecks.
  cohesion?: number;
  coverage?: number;
  entropy?: number;
  sharpness?: number;
  links?: { source: string; target: string; label: string }[];
  coverageBreakdown?: { dominant: number; present: number; edgeCase: number };
  synthesisSuggestions?: { original: string[]; replacement: string; reasoning: string }[];
}
