import { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "world-happiness-2025",
    title: "World Happiness Rating 2025",
    description: "Constructing the deducible space for global well-being and life satisfaction.",
    context: "Global well-being metrics (GDP, social support, freedom). Focus on tensions: 'Economic-Security' vs 'Social-Cohesion'.",
    outcomes: ["High Life Satisfaction", "Systemic Distress"],
    url: "https://worldhappiness.report/"
  },
  {
    id: "ai-sustainability-kaggle",
    title: "AI Sustainability- Kaggle",
    description: "Analyzing the environmental and systemic impact of large-scale AI models.",
    context: "AI training costs and energy efficiency. Focus on: 'Compute-Intensity' vs 'Energy-Efficiency'.",
    outcomes: ["Sustainable Innovation", "Ecological Debt"],
    url: "https://www.kaggle.com/datasets"
  },
  {
    id: "gss-life-survey",
    title: "General Social Survey (GSS) 1972-2022",
    description: "The gold standard of American social trends and life satisfaction since 1972.",
    context: "Longitudinal survey on happiness and financial satisfaction. Focus on: 'American Dream' vs 'Modern Isolation'.",
    outcomes: ["Life Satisfaction", "Social Fragmentation"],
    url: "https://gss.norc.org/"
  },
  {
    id: "big-mac-index",
    title: "Economist Big Mac Index (GitHub)",
    description: "The formalization of the deducible space for global currency valuation.",
    context: "Global price data and PPP. Focus on: 'Purchasing Power Parity' vs 'Currency Valuation'.",
    outcomes: ["Currency Alignment", "Economic Arbitrage"],
    url: "https://github.com/TheEconomist/big-mac-data"
  },
];
