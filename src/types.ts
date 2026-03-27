export enum Centrality {
  GREEN = "GREEN", // Dominant/Central
  YELLOW = "YELLOW", // Present but rare/not decisive
  RED = "RED", // Edge case/Not grounded
}

export interface Tile {
  id: string;
  word: string;
  centrality: Centrality;
  explanation: string;
  dataInsight?: string; // Specific data distribution or pattern
  source?: string; // Historical or scientific source
  category?: string;
  isAIConfirmed?: boolean; // The ★ mark
  relevanceScore?: number; // 0-100
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
  entropy: number; // 0-100 (diversity of concepts)
  explanation: string;
  synthesis?: string; // Original insight derived from the combination of words
  emergentPatterns?: string[]; // Non-obvious connections identified
  links?: { source: string; target: string; label: string }[]; // Semantic links between tiles
  coverageBreakdown?: {
    demographics: number;
    behaviors: number;
    drivers: number;
  };
  synthesisSuggestions?: { original: string[]; replacement: string; reasoning: string }[];
}
