import { Tile, Centrality, BoardMetrics } from "./types";

export const CACHED_BOARDS: Record<string, { tiles: Tile[], metrics: BoardMetrics }> = {
  "world-happiness-2025": {
    tiles: [
      {
        id: "h-1",
        word: "Economic Security",
        centrality: Centrality.DOMINANT,
        explanation: "GDP per capita remains the strongest predictor of life satisfaction across 140+ countries.",
        dataInsight: "Countries with >$40k GDP/capita show a 0.82 correlation with happiness scores.",
        source: "World Happiness Report 2025",
        category: "Economics",
        isAIConfirmed: true,
        relevanceScore: 95,
        specificityScore: 90,
        cachedShadow: {
          id: "h-1-s",
          word: "The Wealth Plateau",
          centrality: Centrality.EDGE_CASE,
          explanation: "The point where incremental income no longer yields incremental happiness, revealing the limits of material handles.",
          dataInsight: "Diminishing returns observed after $75k household income in developed markets.",
          source: "Easterlin Paradox Analysis",
          category: "Psychology",
          specificityScore: 95
        }
      },
      {
        id: "h-2",
        word: "Social Cohesion",
        centrality: Centrality.DOMINANT,
        explanation: "The presence of someone to count on in times of trouble is the primary social driver.",
        dataInsight: "Social support accounts for 33% of the variance in national happiness averages.",
        source: "Gallup World Poll",
        category: "Social",
        isAIConfirmed: true,
        relevanceScore: 92,
        specificityScore: 85,
        cachedShadow: {
          id: "h-2-s",
          word: "Atomized Autonomy",
          centrality: Centrality.EDGE_CASE,
          explanation: "The tension where high individual freedom leads to social fragmentation and loneliness.",
          dataInsight: "Highly individualistic cultures show 15% higher reported loneliness despite high freedom scores.",
          source: "Sociological Audit",
          category: "Social",
          specificityScore: 92
        }
      },
      {
        id: "h-3",
        word: "Institutional Trust",
        centrality: Centrality.PRESENT,
        explanation: "Perceptions of corruption in government and business directly erode the deducible space of well-being.",
        dataInsight: "Low corruption scores correlate with high 'Freedom to make life choices' (r=0.65).",
        source: "Transparency International",
        category: "Governance",
        isAIConfirmed: true,
        relevanceScore: 88,
        specificityScore: 80
      },
      {
        id: "h-4",
        word: "Individual Freedom",
        centrality: Centrality.PRESENT,
        explanation: "The autonomy to choose one's life path is a critical handle for high-ranking nations.",
        dataInsight: "Nordic countries score highest in this category, consistently leading the global index.",
        source: "World Happiness Report",
        category: "Rights",
        isAIConfirmed: true,
        relevanceScore: 85,
        specificityScore: 75
      },
      {
        id: "h-5",
        word: "Systemic Distress",
        centrality: Centrality.EDGE_CASE,
        explanation: "The 'Shadow' of happiness: areas where high GDP fails to translate into well-being due to inequality.",
        dataInsight: "The 'Happiness Gap' between the top and bottom 20% is widening in 60% of surveyed nations.",
        source: "Gini Index Cross-Analysis",
        category: "Inequality",
        isAIConfirmed: true,
        relevanceScore: 80,
        specificityScore: 85
      }
    ],
    metrics: {
      cohesion: 88,
      coverage: 92,
      entropy: 45,
      sharpness: 90,
      explanation: "The board successfully maps the tension between material security and social infrastructure.",
      synthesis: "Global well-being is a structural outcome of the balance between Institutional Trust and Individual Freedom.",
      emergentPatterns: ["The Nordic Model", "The Wealth-Happiness Plateau"],
      links: [
        { source: "Economic Security", target: "Individual Freedom", label: "Enables" },
        { source: "Institutional Trust", target: "Social Cohesion", label: "Protects" }
      ],
      coverageBreakdown: { dominant: 40, present: 40, edgeCase: 20 },
      synthesisSuggestions: []
    }
  },
  "ai-sustainability-kaggle": {
    tiles: [
      {
        id: "ai-1",
        word: "Compute Intensity",
        centrality: Centrality.DOMINANT,
        explanation: "The exponential growth in parameters (FLOPs) required for state-of-the-art LLMs.",
        dataInsight: "Training runs for frontier models now exceed 10^26 FLOPs, doubling every 6 months.",
        source: "Epoch AI Database",
        category: "Technical",
        isAIConfirmed: true,
        relevanceScore: 98,
        specificityScore: 95,
        cachedShadow: {
          id: "ai-1-s",
          word: "Algorithmic Efficiency",
          centrality: Centrality.PRESENT,
          explanation: "The counter-trend: new architectures (like Mixture-of-Experts) that reduce compute per token.",
          dataInsight: "MoE models can reduce active parameters by 90% while maintaining performance.",
          source: "DeepMind Research",
          category: "Software",
          specificityScore: 92
        }
      },
      {
        id: "ai-2",
        word: "Energy Efficiency",
        centrality: Centrality.DOMINANT,
        explanation: "The hardware-level counter-force: TFLOPS per Watt in modern H100/B200 clusters.",
        dataInsight: "Newer architectures show 3x efficiency gains, but total consumption still rises due to scale.",
        source: "NVIDIA Sustainability Report",
        category: "Hardware",
        isAIConfirmed: true,
        relevanceScore: 94,
        specificityScore: 88,
        cachedShadow: {
          id: "ai-2-s",
          word: "Jevons Paradox",
          centrality: Centrality.EDGE_CASE,
          explanation: "The phenomenon where increased efficiency leads to even higher total consumption due to lower costs.",
          dataInsight: "Every 2x gain in GPU efficiency has historically led to a 4x increase in total compute demand.",
          source: "Economic Theory",
          category: "Economics",
          specificityScore: 96
        }
      },
      {
        id: "ai-3",
        word: "Innovation Velocity",
        centrality: Centrality.PRESENT,
        explanation: "The market pressure to release models faster, often bypassing efficiency optimizations.",
        dataInsight: "Average time between major model releases has dropped from 18 months to 4 months.",
        source: "Kaggle AI Trends 2024",
        category: "Market",
        isAIConfirmed: true,
        relevanceScore: 85,
        specificityScore: 70
      },
      {
        id: "ai-4",
        word: "Carbon Constraint",
        centrality: Centrality.PRESENT,
        explanation: "The regulatory and physical limits on data center power availability.",
        dataInsight: "Grid capacity is now the #1 bottleneck for new AI cluster deployments in Tier 1 markets.",
        source: "IEA Electricity Report",
        category: "Environment",
        isAIConfirmed: true,
        relevanceScore: 90,
        specificityScore: 82
      },
      {
        id: "ai-5",
        word: "Model Obsolescence",
        centrality: Centrality.EDGE_CASE,
        explanation: "The 'E-waste' of software: models that become redundant within months of training.",
        dataInsight: "70% of models on HuggingFace have zero downstream fine-tuning activity after 90 days.",
        source: "HuggingFace Metrics",
        category: "Lifecycle",
        isAIConfirmed: true,
        relevanceScore: 75,
        specificityScore: 90
      }
    ],
    metrics: {
      cohesion: 85,
      coverage: 88,
      entropy: 50,
      sharpness: 85,
      explanation: "The board captures the critical tension between technical ambition and physical resource limits.",
      synthesis: "AI sustainability is not a hardware problem, but a conflict between Innovation Velocity and Carbon Constraints.",
      emergentPatterns: ["The Efficiency Paradox", "Grid-Locked Innovation"],
      links: [
        { source: "Compute Intensity", target: "Carbon Constraint", label: "Strains" },
        { source: "Energy Efficiency", target: "Innovation Velocity", label: "Subsidizes" }
      ],
      coverageBreakdown: { dominant: 40, present: 40, edgeCase: 20 },
      synthesisSuggestions: []
    }
  },
  "gss-life-survey": {
    tiles: [
      {
        id: "gss-1",
        word: "Marital Status",
        centrality: Centrality.DOMINANT,
        explanation: "Historically the strongest demographic predictor of 'Very Happy' reports in the GSS.",
        dataInsight: "Married individuals consistently report 15-20% higher happiness levels than single counterparts.",
        source: "General Social Survey (1972-2022)",
        category: "Demographics",
        isAIConfirmed: true,
        relevanceScore: 96,
        specificityScore: 92,
        cachedShadow: {
          id: "gss-1-s",
          word: "The Marriage Gap",
          centrality: Centrality.PRESENT,
          explanation: "The widening divide in happiness between married and never-married individuals over the last decade.",
          dataInsight: "The happiness premium for marriage has increased by 8% since 2000.",
          source: "GSS Longitudinal Study",
          category: "Social",
          specificityScore: 94
        }
      },
      {
        id: "gss-2",
        word: "Health Status",
        centrality: Centrality.DOMINANT,
        explanation: "Self-reported health is the primary physical handle for life satisfaction.",
        dataInsight: "Moving from 'Fair' to 'Excellent' health is equivalent to a 3x increase in household income for happiness.",
        source: "GSS Health Module",
        category: "Well-being",
        isAIConfirmed: true,
        relevanceScore: 94,
        specificityScore: 88,
        cachedShadow: {
          id: "gss-2-s",
          word: "Health Optimism Bias",
          centrality: Centrality.EDGE_CASE,
          explanation: "The tendency for individuals to report 'Good' health despite chronic conditions, protecting psychological well-being.",
          dataInsight: "40% of individuals with chronic conditions still report 'Good' or 'Excellent' life satisfaction.",
          source: "Psychological Audit",
          category: "Psychology",
          specificityScore: 90
        }
      },
      {
        id: "gss-3",
        word: "Financial Satisfaction",
        centrality: Centrality.PRESENT,
        explanation: "Relative wealth vs. absolute income: how satisfied people are with their financial position.",
        dataInsight: "Satisfaction with finances is a better predictor of happiness than the actual dollar amount earned.",
        source: "GSS Economic Trends",
        category: "Economics",
        isAIConfirmed: true,
        relevanceScore: 88,
        specificityScore: 85
      },
      {
        id: "gss-4",
        word: "Work Fulfillment",
        centrality: Centrality.PRESENT,
        explanation: "The sense of purpose derived from daily labor and professional contribution.",
        dataInsight: "Job satisfaction correlates 0.55 with overall life satisfaction in the post-2010 cohorts.",
        source: "GSS Labor Module",
        category: "Career",
        isAIConfirmed: true,
        relevanceScore: 82,
        specificityScore: 78
      },
      {
        id: "gss-5",
        word: "Social Isolation",
        centrality: Centrality.EDGE_CASE,
        explanation: "The 'Shadow' of modern life: the rising number of 'zero close friends' reports.",
        dataInsight: "Reports of 'no close confidants' have tripled since 1985, creating a happiness floor.",
        source: "GSS Social Network Analysis",
        category: "Social",
        isAIConfirmed: true,
        relevanceScore: 85,
        specificityScore: 95
      }
    ],
    metrics: {
      cohesion: 90,
      coverage: 95,
      entropy: 40,
      sharpness: 92,
      explanation: "The GSS board provides a long-term view of the structural pillars of American life satisfaction.",
      synthesis: "Life satisfaction is a deducible outcome of the interaction between Marital Stability and Health Status.",
      emergentPatterns: ["The Marriage Premium", "The Loneliness Epidemic"],
      links: [
        { source: "Health Status", target: "Work Fulfillment", label: "Enables" },
        { source: "Marital Status", target: "Social Isolation", label: "Mitigates" }
      ],
      coverageBreakdown: { dominant: 40, present: 40, edgeCase: 20 },
      synthesisSuggestions: []
    }
  },
  "titanic": {
    tiles: [
      {
        id: "t-1",
        word: "Class Priority",
        centrality: Centrality.DOMINANT,
        explanation: "The structural advantage of 1st class passengers in accessing the boat deck.",
        dataInsight: "1st Class survival rate: 62% vs 3rd Class: 24%.",
        source: "Titanic Passenger Manifest",
        category: "Social",
        isAIConfirmed: true,
        relevanceScore: 98,
        specificityScore: 95,
        cachedShadow: {
          id: "t-1-s",
          word: "Structural Barrier",
          centrality: Centrality.PRESENT,
          explanation: "The physical gates and distance from 3rd class quarters to the deck, creating a deducible lag in response.",
          dataInsight: "3rd class passengers had to navigate 5x more distance to reach lifeboats.",
          source: "Deck Plan Analysis",
          category: "Logistics",
          specificityScore: 98
        }
      },
      {
        id: "t-2",
        word: "Chivalry Protocol",
        centrality: Centrality.DOMINANT,
        explanation: "The 'Women and Children First' directive that overrode class in many instances.",
        dataInsight: "Female survival rate: 74% vs Male: 19%.",
        source: "Historical Records",
        category: "Cultural",
        isAIConfirmed: true,
        relevanceScore: 96,
        specificityScore: 92,
        cachedShadow: {
          id: "t-2-s",
          word: "Legacy Sacrifice",
          centrality: Centrality.EDGE_CASE,
          explanation: "The voluntary refusal of 1st class men to board boats, prioritizing the chivalry handle over class priority.",
          dataInsight: "1st class men had lower survival (33%) than 3rd class children (34%).",
          source: "Survivor Accounts",
          category: "Cultural",
          specificityScore: 95
        }
      },
      {
        id: "t-3",
        word: "Lifeboat Scarcity",
        centrality: Centrality.PRESENT,
        explanation: "The physical limit of 20 boats for 2,200 people, creating a zero-sum game.",
        dataInsight: "Only 1,178 seats available; 705 actually used.",
        source: "British Board of Trade Inquiry",
        category: "Logistics",
        isAIConfirmed: true,
        relevanceScore: 92,
        specificityScore: 90
      },
      {
        id: "t-4",
        word: "Allocation Logic",
        centrality: Centrality.PRESENT,
        explanation: "The systemic decision-making process of officers at different lifeboat stations.",
        dataInsight: "Port side (Lightoller) was 'Women ONLY', Starboard (Murdoch) was 'Women FIRST'.",
        source: "Officer Testimony",
        category: "Governance",
        isAIConfirmed: true,
        relevanceScore: 88,
        specificityScore: 85
      },
      {
        id: "t-5",
        word: "Structural Tension",
        centrality: Centrality.EDGE_CASE,
        explanation: "The conflict between the legacy of class and the emerging protocol of chivalry.",
        dataInsight: "3rd Class women had lower survival than 1st Class women, showing class still mattered.",
        source: "Causal Analysis",
        category: "Synthesis",
        isAIConfirmed: true,
        relevanceScore: 85,
        specificityScore: 95
      }
    ],
    metrics: {
      cohesion: 92,
      coverage: 90,
      entropy: 35,
      sharpness: 95,
      explanation: "The board perfectly illustrates the 'Deducible Space' of the Titanic disaster.",
      synthesis: "Survival was a structural inevitability of the tension between Class Priority and Chivalry Protocol.",
      emergentPatterns: ["The Gender-Class Intersection", "Station-Specific Logic"],
      links: [
        { source: "Lifeboat Scarcity", target: "Allocation Logic", label: "Forces" },
        { source: "Class Priority", target: "Chivalry Protocol", label: "Conflicts with" }
      ],
      coverageBreakdown: { dominant: 40, present: 40, edgeCase: 20 },
      synthesisSuggestions: []
    }
  }
};
