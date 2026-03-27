import { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "titanic",
    title: "Titanic Survival",
    description: "What factors truly determined who survived the 1912 disaster?",
    context: "Titanic passenger data (pclass, sex, age, fare) and historical context of maritime disasters. Focus on how human factors like communication, physical location, and social status intersected.",
    outcomes: ["Survival", "Death"],
  },
  {
    id: "climate",
    title: "Climate Change Adoption",
    description: "What drives individuals to adopt sustainable behaviors?",
    context: "Psychological and sociological studies on climate action, including factors like social norms, perceived efficacy, economic barriers, and cognitive biases.",
    outcomes: ["Action", "Inaction"],
  },
  {
    id: "social-media",
    title: "Social Media Addiction",
    description: "What makes digital platforms so difficult to put down?",
    context: "Neuroscience and behavioral psychology of social media usage, dopamine loops, social validation, FOMO, and algorithmic design.",
    outcomes: ["Addiction", "Healthy Use"],
  },
  {
    id: "great-resignation",
    title: "The Great Resignation",
    description: "Why did millions of workers leave their jobs post-pandemic?",
    context: "Analyzing factors like Burnout, Remote Flexibility, Purpose-Driven Work, and Wage Stagnation in the post-2020 economy.",
    outcomes: ["Retention", "Resignation"],
  },
  {
    id: "ai-alignment",
    title: "AI Alignment & Safety",
    description: "What determines if an AI system remains beneficial to humanity?",
    context: "Exploring concepts like Value Alignment, Robustness, Interpretability, and Recursive Self-Improvement in advanced AI systems.",
    outcomes: ["Alignment", "Misalignment"],
  },
  {
    id: "longevity",
    title: "Blue Zones & Longevity",
    description: "What are the common denominators in regions where people live past 100?",
    context: "Analyzing Social Integration, Natural Movement, Plant-Slanted Diet, and Sense of Purpose (Ikigai) in long-lived populations.",
    outcomes: ["Longevity", "Standard Lifespan"],
  },
  {
    id: "ai-sustainability",
    title: "AI & Sustainability",
    description: "How does model choice and geography impact the climate crisis?",
    context: "Analyzing the environmental impact of AI. Compares Reasoning models (GPT-5) vs Statistical models (Llama-4). Focuses on Geographical Efficiency (Sweden vs India carbon intensity) and the 'Diminishing Marginal Utility' of using heavy models for simple tasks like email writing.",
    outcomes: ["Carbon Neutrality", "Environmental Crisis"],
  },
];
