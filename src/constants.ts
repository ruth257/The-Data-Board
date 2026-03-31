import { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "titanic",
    title: "Titanic Survival Analysis",
    description: "Analyze the statistical drivers of survival in the 1912 disaster.",
    context: "Titanic passenger data (pclass, sex, age, fare). Focus on the 'Survival Delta' between classes, 'Gender Bias' in lifeboat allocation, and 'Fare Correlation' with cabin location. Use vocabulary that describes data segments and survival probabilities.",
    outcomes: ["Survival", "Death"],
  },
  {
    id: "e-commerce",
    title: "E-commerce Conversion Audit",
    description: "Identify bottlenecks in the customer journey from landing to purchase.",
    context: "Funnel data including Landing Page Views, Add-to-Cart, and Checkout Completion. Focus on 'Cart Abandonment Rate', 'Device-Specific Friction', and 'Payment Gateway Latency'. Use vocabulary that identifies specific technical or behavioral drop-off points.",
    outcomes: ["Purchase", "Abandonment"],
  },
  {
    id: "climate-data",
    title: "Climate Trend Analysis",
    description: "Analyze the variance and anomalies in global temperature datasets.",
    context: "Historical temperature anomalies, carbon concentration data, and sea-level rise metrics. Focus on 'Statistical Outliers', 'Decadal Variance', and 'Feedback Loop Acceleration'. Use vocabulary that describes long-term trends and data volatility.",
    outcomes: ["Threshold Breach", "Stabilization"],
  },
  {
    id: "saas-retention",
    title: "SaaS Retention Cohorts",
    description: "Why do users churn after the first 30 days?",
    context: "User activity logs, feature engagement metrics, and subscription status. Focus on 'Churn Velocity', 'Feature Adoption Lag', and 'Power User Concentration'. Use vocabulary that segments users by behavior and engagement depth.",
    outcomes: ["Renewal", "Churn"],
  },
  {
    id: "google-search-console",
    title: "Search Performance Audit",
    description: "Analyze the relationship between impressions, clicks, and ranking position.",
    context: "Google Search Console metrics. Focus on 'CTR Decay' relative to position, 'Query Intent Mismatch', and 'URL Canonicalization Issues'. Use vocabulary that describes search visibility and user intent patterns.",
    outcomes: ["High Visibility", "Search Penalty"],
  },
  {
    id: "data-literacy",
    title: "Data Literacy & Communication",
    description: "The best vocabulary for discussing and analyzing any dataset.",
    context: "General data analysis principles. Focus on 'Selection Bias', 'Correlation vs Causation', 'Sample Size Adequacy', and 'Visualization Distortion'. Use vocabulary that helps teams negotiate meaning and validate insights across any data source.",
    outcomes: ["Informed Decision", "Misinterpretation"],
  },
];
