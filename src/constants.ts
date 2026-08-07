import { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "big-mac-index",
    title: "Economist Big Mac Index (GitHub)",
    description: "The formalization of the deducible space for global currency valuation.",
    context: "Global price data and PPP. Focus on: 'Purchasing Power Parity' vs 'Currency Valuation'.",
    outcomes: ["Currency Alignment", "Economic Arbitrage"],
    url: "https://github.com/TheEconomist/big-mac-data"
  },
  {
    id: "world-happiness-2025",
    title: "World Happiness Rating 2025",
    description: "Constructing the deducible space for global well-being and life satisfaction.",
    context: "Global well-being metrics (GDP, social support, freedom). Focus on tensions: 'Economic-Security' vs 'Social-Cohesion'.",
    outcomes: ["High Life Satisfaction", "Systemic Distress"],
    url: "https://worldhappiness.report/"
  },
  {
    id: "gpts-are-gpts",
    title: "GPTs are GPTs (OpenAI/Penn)",
    description: "The structural auditing of AI exposure across 923 US occupations based on human and model ratings.",
    context: "Structural exposure of cognitive and manual labor. Focus on tensions: 'Syntactic Sandbox' vs 'Physical Anchor'. Base study: Eloundou et al. (arXiv, 2023).",
    outcomes: ["Cognitive Automation", "Embodied & Relational Retention"],
    url: "https://arxiv.org/abs/2303.10130"
  },
  {
    id: "candy-power-ranking",
    title: "Candy Power Ranking (FiveThirtyEight)",
    description: "85 real candies, each rated in thousands of randomized online head-to-head matchups.",
    context: "Every row is one candy with its ingredients/format (chocolate, fruity, caramel, peanuty/almondy, nougat, crisped rice wafer, hard, bar, pluribus) plus its sugar percentile, price percentile, and overall win percentage against other candies. Question: what actually explains a candy's win percentage?",
    outcomes: ["High Win Rate", "Low Win Rate"],
    url: "https://github.com/fivethirtyeight/data/tree/master/candy-power-ranking"
  },
];
