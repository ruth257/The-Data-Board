import { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "titanic",
    title: "Titanic Survival",
    description: "What factors truly determined who survived the 1912 disaster?",
    context: "Titanic passenger data (pclass, sex, age, fare) and historical context of maritime disasters. Focus on how human factors like communication, physical location, and social status intersected. Include foundational variables like Demographics (Gender, Age, Class), Behaviors (Lifeboat Access, Deck Location), and Drivers (Chivalry, Panic).",
    outcomes: ["Survival", "Death"],
  },
  {
    id: "climate",
    title: "Climate Change Adoption",
    description: "What drives individuals to adopt sustainable behaviors?",
    context: "Psychological and sociological studies on climate action, including factors like social norms, perceived efficacy, economic barriers, and cognitive biases. Include foundational variables like Demographics (Income, Education, Urban/Rural), Behaviors (Recycling, Public Transit), and Drivers (Climate Anxiety, Social Pressure).",
    outcomes: ["Action", "Inaction"],
  },
  {
    id: "social-media",
    title: "Social Media Addiction",
    description: "What makes digital platforms so difficult to put down?",
    context: "Neuroscience and behavioral psychology of social media usage, dopamine loops, social validation, FOMO, and algorithmic design. Include foundational variables like Demographics (Gen Z, Seniors, Gender), Behaviors (Infinite Scroll, Notification Checking), and Drivers (Social Comparison, Boredom).",
    outcomes: ["Addiction", "Healthy Use"],
  },
  {
    id: "great-resignation",
    title: "The Great Resignation",
    description: "Why did millions of workers leave their jobs post-pandemic?",
    context: "Analyzing factors like Burnout, Remote Flexibility, Purpose-Driven Work, and Wage Stagnation in the post-2020 economy. Include foundational variables like Demographics (Industry, Tenure, Parental Status), Behaviors (Resignation, Quiet Quitting), and Drivers (Work-Life Balance, Mental Health).",
    outcomes: ["Retention", "Resignation"],
  },
  {
    id: "ai-alignment",
    title: "AI Alignment & Safety",
    description: "What determines if an AI system remains beneficial to humanity?",
    context: "Exploring concepts like Value Alignment, Robustness, Interpretability, and Recursive Self-Improvement in advanced AI systems. Include foundational variables like Demographics (Developer Background, User Region), Behaviors (Prompt Injection, Model Compliance), and Drivers (Competitive Pressure, Safety Concerns).",
    outcomes: ["Alignment", "Misalignment"],
  },
  {
    id: "longevity",
    title: "Blue Zones & Longevity",
    description: "What are the common denominators in regions where people live past 100?",
    context: "Analyzing Social Integration, Natural Movement, Plant-Slanted Diet, and Sense of Purpose (Ikigai) in long-lived populations. Include foundational variables like Demographics (Centenarians, Geographic Region), Behaviors (Communal Eating, Daily Walking), and Drivers (Social Connection, Stress Reduction).",
    outcomes: ["Longevity", "Standard Lifespan"],
  },
  {
    id: "ai-sustainability",
    title: "AI & Sustainability",
    description: "How does model choice and geography impact the climate crisis?",
    context: "Analyzing the environmental impact of AI. Compares Reasoning models (GPT-5) vs Statistical models (Llama-4). Focuses on Geographical Efficiency (Sweden vs India carbon intensity) and the 'Diminishing Marginal Utility' of using heavy models for simple tasks like email writing. Include foundational variables like Demographics (Developer Location, User Type), Behaviors (Model Selection, Task Frequency), and Drivers (Carbon Awareness, Cost Efficiency).",
    outcomes: ["Carbon Neutrality", "Environmental Crisis"],
  },
  {
    id: "google-search-console",
    title: "Google Search Console Audit",
    description: "What drives search visibility and click-through rates?",
    context: "Analyzing organic search performance data. Focuses on the relationship between Impressions, Clicks, CTR, and Average Position. Include foundational variables like Demographics (Country, Device, Search Appearance), Behaviors (Query Intent, Page Depth), and Drivers (Algorithm Updates, Content Quality, Backlink Profile).",
    outcomes: ["High Visibility", "Search Penalty"],
  },
  {
    id: "spotify-trends",
    title: "Spotify Streaming Trends",
    description: "What makes a song go viral in the streaming era?",
    context: "Analyzing Spotify's public streaming data and algorithmic playlists. Focuses on 'Discover Weekly' mechanics, skip rates, and genre shifts. Include foundational variables like Demographics (Gen Z Listeners, Global Markets), Behaviors (Skip Rate, Save-to-Collection, Repeat Plays), and Drivers (TikTok Virality, Editorial Playlisting, Mood-Based Search).",
    outcomes: ["Chart-Topper", "One-Hit Wonder"],
  },
];
