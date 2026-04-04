import { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "titanic",
    title: "Titanic Survival Analysis",
    description: "Constructing the deducible space for survival in the 1912 disaster.",
    context: "Passenger data (pclass, sex, age, fare). Move beyond correlational anecdotes like 'women survived more' to a formal vocabulary of the deducible space. Focus on structural tension: 'Chivalry-Legacy' vs 'Class-Priority', 'Lifeboat-Scarcity' vs 'Allocation-Logic'. The goal is a minimal set of concepts where narrative conclusions follow inevitably.",
    outcomes: ["Survival", "Death"],
  },
  {
    id: "plastic-leakage",
    title: "Global Plastic Leakage",
    description: "Analyzing the systemic drivers of plastic waste in the environment.",
    context: "Global waste management data, production metrics, and environmental leakage rates. Construct a deducible space that bridges facts and deduction. Focus on cohesive handles: 'Waste-Velocity', 'Infrastructure-Lag', 'Circular-Fiction', 'Export-Dependency'. Use pseudo-antonyms to introduce structural tension that makes narrative conclusions about leakage inevitable.",
    outcomes: ["Environmental Impact", "Mitigation"],
  },
  {
    id: "e-commerce",
    title: "E-commerce Conversion Audit",
    description: "The deducible space of the customer journey.",
    context: "Funnel data from landing to purchase. Avoid local anecdotes; build a globally coherent vocabulary. Focus on 'Friction-Gravity', 'Intent-Decay', 'Trust-Deficit', 'Checkout-Latency'. The result should be a space from which consistent narrative about conversion follows.",
    outcomes: ["Purchase", "Abandonment"],
  },
  {
    id: "climate-data",
    title: "Climate Trend Analysis",
    description: "The formalization of the deducible space for climate variance.",
    context: "Temperature anomalies, carbon data, and feedback loops. Focus on 'Anomaly-Normalization', 'Feedback-Acceleration', 'Threshold-Fragility'. Construct a space where long-term narrative conclusions follow inevitably from the minimal set of grounded concepts.",
    outcomes: ["Threshold Breach", "Stabilization"],
  },
  {
    id: "saas-retention",
    title: "SaaS Retention Cohorts",
    description: "Why do users churn? Constructing the reasoning space.",
    context: "User activity and engagement logs. Focus on 'Value-Lag', 'Feature-Fatigue', 'Engagement-Erosion', 'Onboarding-Friction'. The vocabulary should be a cohesive set that makes the narrative of churn deducible.",
    outcomes: ["Renewal", "Churn"],
  },
  {
    id: "google-search-console",
    title: "Search Performance Audit",
    description: "The deducible space of search visibility.",
    context: "Impressions, clicks, and ranking data. Focus on 'Intent-Mismatch', 'Visibility-Decay', 'Authority-Deficit', 'Query-Cannibalization'. Build a space where search performance narratives follow inevitably.",
    outcomes: ["High Visibility", "Search Penalty"],
  },
  {
    id: "data-literacy",
    title: "Data Literacy & Communication",
    description: "The formalization of the deducible space for any dataset.",
    context: "General data analysis principles. Focus on 'Selection-Bias', 'Causal-Illusion', 'Sample-Fragility', 'Narrative-Coherence'. Use vocabulary that helps teams construct the deducible space upstream of causal graphs.",
    outcomes: ["Informed Decision", "Misinterpretation"],
  },
  {
    id: "world-happiness-2025",
    title: "World Happiness Rating 2025",
    description: "Constructing the deducible space for global well-being and life satisfaction.",
    context: "Global happiness data (GDP per capita, social support, healthy life expectancy, freedom, generosity, perceptions of corruption). Move beyond simple rankings to a formal vocabulary of the deducible space. Focus on structural tensions: 'Economic-Security' vs 'Social-Cohesion', 'Individual-Freedom' vs 'Institutional-Trust'. The goal is a minimal set of concepts where narrative conclusions about global well-being follow inevitably.",
    outcomes: ["High Life Satisfaction", "Systemic Distress"],
  },
];
