import { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "world-happiness-2025",
    title: "World Happiness Rating 2025",
    description: "Constructing the deducible space for global well-being and life satisfaction.",
    context: "Global happiness data (GDP per capita, social support, healthy life expectancy, freedom, generosity, perceptions of corruption). Move beyond simple rankings to a formal vocabulary of the deducible space. Focus on structural tensions: 'Economic-Security' vs 'Social-Cohesion', 'Individual-Freedom' vs 'Institutional-Trust'. The goal is a minimal set of concepts where narrative conclusions about global well-being follow inevitably.",
    outcomes: ["High Life Satisfaction", "Systemic Distress"],
  },
  {
    id: "ai-sustainability-kaggle",
    title: "AI Sustainability- Kaggle",
    description: "Analyzing the environmental and systemic impact of large-scale AI models.",
    context: "Kaggle dataset on AI model training costs, energy consumption, and hardware efficiency. Construct a deducible space for sustainable AI development. Focus on structural tensions: 'Compute-Intensity' vs 'Energy-Efficiency', 'Innovation-Velocity' vs 'Carbon-Constraint', 'Hardware-Lifecycle' vs 'Model-Obsolescence'. The goal is a vocabulary that makes the narrative of AI's environmental footprint deducible.",
    outcomes: ["Sustainable Innovation", "Ecological Debt"],
  },
  {
    id: "gss-life-survey",
    title: "General Social Survey (GSS) 1972-2022",
    description: "The gold standard of American social trends and life satisfaction since 1972.",
    context: "Longitudinal survey data on happiness, health, marital status, and financial satisfaction. Construct the deducible space for the 'American Dream' vs 'Modern Isolation'. Focus on structural handles: 'Marital-Status', 'Financial-Satisfaction', 'Work-Fulfillment', 'Social-Isolation'. This data is open, public, and requires no specific attribution for analysis.",
    outcomes: ["Life Satisfaction", "Social Fragmentation"],
  },
  {
    id: "titanic",
    title: "Titanic Survival Analysis",
    description: "Constructing the deducible space for survival in the 1912 disaster.",
    context: "Passenger data (pclass, sex, age, fare). Move beyond correlational anecdotes like 'women survived more' to a formal vocabulary of the deducible space. Focus on structural tension: 'Chivalry-Legacy' vs 'Class-Priority', 'Lifeboat-Scarcity' vs 'Allocation-Logic'. The goal is a minimal set of concepts where narrative conclusions follow inevitably.",
    outcomes: ["Survival", "Death"],
  },
  {
    id: "climate-data",
    title: "Climate Trend Analysis",
    description: "The formalization of the deducible space for climate variance.",
    context: "Temperature anomalies, carbon data, and feedback loops. Focus on 'Anomaly-Normalization', 'Feedback-Acceleration', 'Threshold-Fragility'. Construct a space where long-term narrative conclusions follow inevitably from the minimal set of grounded concepts.",
    outcomes: ["Threshold Breach", "Stabilization"],
  },
];
