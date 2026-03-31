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
  source?: string; // Historical or scientific source
  category?: string;
  isAIConfirmed?: boolean; // The ★ mark
  relevanceScore?: number; // 0-100
  specificityScore: number; // 0-100
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  context: string; // Detailed context for the AI
  outcomes: string[]; // e.g., ["Survival", "Death"]
}

export interface BoardMetrics {
  cohesion: number; // 0-100
  coverage: number; // 0-100
  entropy: number; // 0-100
  sharpness: number; // 0-100 (Average specificity of findings)
  explanation: string;
  synthesis?: string; // The "Headline Insight" / Eureka Moment
  emergentPatterns?: string[];
  links?: { source: string; target: string; label: string }[];
  coverageBreakdown?: {
    dominant: number;
    present: number;
    edgeCase: number;
  };
  synthesisSuggestions?: { original: string[]; replacement: string; reasoning: string }[];
}
