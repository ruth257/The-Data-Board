import { Tile, Centrality, BoardMetrics } from "./types";

export const CACHED_BOARDS: Record<string, { tiles: Tile[], metrics: BoardMetrics, cachedExpansion?: Tile[] }> = {
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
    cachedExpansion: [
      {
        id: "h-exp-1",
        word: "Healthy Life Expectancy",
        centrality: Centrality.DOMINANT,
        explanation: "The biological handle for well-being, representing the physical capacity for life satisfaction.",
        dataInsight: "Each additional year of healthy life expectancy adds 0.15 to the national happiness score.",
        source: "WHO Data",
        category: "Health",
        specificityScore: 92
      },
      {
        id: "h-exp-2",
        word: "Generosity",
        centrality: Centrality.PRESENT,
        explanation: "The altruistic driver of community resilience and social capital.",
        dataInsight: "Donations to charity correlate with higher positive affect at the individual level.",
        source: "World Giving Index",
        category: "Social",
        specificityScore: 88
      },
      {
        id: "h-exp-3",
        word: "The Freedom Gap",
        centrality: Centrality.EDGE_CASE,
        explanation: "The structural tension between legal rights and the economic capability to exercise them.",
        dataInsight: "High freedom scores in low-GDP nations often fail to translate into life satisfaction.",
        source: "Socio-Economic Audit",
        category: "Rights",
        specificityScore: 95
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
    cachedExpansion: [
      {
        id: "ai-exp-1",
        word: "Hardware Lifecycle",
        centrality: Centrality.DOMINANT,
        explanation: "The physical turnover of GPUs and its systemic e-waste impact.",
        dataInsight: "Average GPU lifespan in high-intensity clusters is now under 3 years.",
        source: "Supply Chain Audit",
        category: "Hardware",
        specificityScore: 94
      },
      {
        id: "ai-exp-2",
        word: "Model Distillation",
        centrality: Centrality.PRESENT,
        explanation: "Techniques to shrink models for edge deployment, reducing inference energy.",
        dataInsight: "Distilled models can retain 95% accuracy with 10x fewer parameters.",
        source: "AI Research Paper",
        category: "Software",
        specificityScore: 91
      },
      {
        id: "ai-exp-3",
        word: "Compute Sovereignty",
        centrality: Centrality.EDGE_CASE,
        explanation: "The geopolitical tension over access to high-end silicon and energy grids.",
        dataInsight: "Export controls on H100s have created a shadow market for compute.",
        source: "Geopolitical Report",
        category: "Policy",
        specificityScore: 96
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
    cachedExpansion: [
      {
        id: "gss-exp-1",
        word: "Educational Attainment",
        centrality: Centrality.DOMINANT,
        explanation: "The primary handle for socio-economic mobility and status in the GSS.",
        dataInsight: "Degree holders report 12% higher life satisfaction than non-degree holders.",
        source: "GSS Education Module",
        category: "Education",
        specificityScore: 93
      },
      {
        id: "gss-exp-2",
        word: "Religious Affiliation",
        centrality: Centrality.PRESENT,
        explanation: "The traditional handle for community and shared meaning.",
        dataInsight: "Regular attendance at services correlates with a 10% happiness premium.",
        source: "GSS Religion Module",
        category: "Culture",
        specificityScore: 89
      },
      {
        id: "gss-exp-3",
        word: "Political Polarization",
        centrality: Centrality.EDGE_CASE,
        explanation: "The erosion of social cohesion through ideological divergence.",
        dataInsight: "Partisan hostility has doubled since 1994, impacting local social trust.",
        source: "Pew Research Cross-Analysis",
        category: "Politics",
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
    cachedExpansion: [
      {
        id: "t-exp-1",
        word: "Fare Variance",
        centrality: Centrality.DOMINANT,
        explanation: "The economic handle that dictated cabin proximity to the boat deck.",
        dataInsight: "Passengers paying >£50 had a 70% survival rate.",
        source: "Economic Audit",
        category: "Economics",
        specificityScore: 94
      },
      {
        id: "t-exp-2",
        word: "Age Demographic",
        centrality: Centrality.PRESENT,
        explanation: "The prioritization of children across all classes, overriding some class barriers.",
        dataInsight: "Child survival rate was 52% overall, much higher than adult males.",
        source: "Demographic Study",
        category: "Demographics",
        specificityScore: 91
      },
      {
        id: "t-exp-3",
        word: "Crew Sacrifice",
        centrality: Centrality.EDGE_CASE,
        explanation: "The systemic refusal of staff to occupy lifeboat seats, prioritizing passenger handles.",
        dataInsight: "Crew survival was only 23%, despite being the most physically capable.",
        source: "Historical Records",
        category: "Social",
        specificityScore: 97
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
  },
  "climate-data": {
    tiles: [
      {
        id: "c-1",
        word: "Temperature Anomalies",
        centrality: Centrality.DOMINANT,
        explanation: "The core handle for variance, measuring deviation from the 1951-1980 baseline.",
        dataInsight: "Global average temperature has risen by 1.2°C since the pre-industrial era.",
        source: "NASA GISS",
        category: "Climate",
        isAIConfirmed: true,
        relevanceScore: 98,
        specificityScore: 95
      },
      {
        id: "c-2",
        word: "Carbon Concentration",
        centrality: Centrality.DOMINANT,
        explanation: "The primary driver of the greenhouse effect, measured in parts per million (ppm).",
        dataInsight: "Atmospheric CO2 reached 420 ppm in 2024, the highest in 3 million years.",
        source: "NOAA Mauna Loa Observatory",
        category: "Atmosphere",
        isAIConfirmed: true,
        relevanceScore: 97,
        specificityScore: 92
      },
      {
        id: "c-3",
        word: "Feedback Loops",
        centrality: Centrality.PRESENT,
        explanation: "Self-reinforcing mechanisms like Albedo reduction from melting Arctic ice.",
        dataInsight: "Arctic sea ice is declining at a rate of 12.2% per decade.",
        source: "National Snow and Ice Data Center",
        category: "Feedback",
        isAIConfirmed: true,
        relevanceScore: 92,
        specificityScore: 88
      },
      {
        id: "c-4",
        word: "Threshold Fragility",
        centrality: Centrality.EDGE_CASE,
        explanation: "The risk of crossing irreversible tipping points in the Earth system.",
        dataInsight: "9 of 15 global tipping points are now considered 'active' or 'at risk'.",
        source: "Potsdam Institute",
        category: "Risk",
        isAIConfirmed: true,
        relevanceScore: 88,
        specificityScore: 95
      }
    ],
    cachedExpansion: [
      {
        id: "c-exp-1",
        word: "Anomaly Normalization",
        centrality: Centrality.DOMINANT,
        explanation: "The psychological shift where extreme weather becomes the baseline, reducing urgency.",
        dataInsight: "Public perception of 'normal' weather shifts within a 5-year window.",
        source: "Social Science Study",
        category: "Psychology",
        specificityScore: 94
      },
      {
        id: "c-exp-2",
        word: "Feedback Acceleration",
        centrality: Centrality.PRESENT,
        explanation: "The self-reinforcing loops that drive variance faster than linear models predict.",
        dataInsight: "Permafrost melt could release 1500 billion tons of carbon.",
        source: "Geophysical Research",
        category: "Feedback",
        specificityScore: 92
      },
      {
        id: "c-exp-3",
        word: "Threshold Breach",
        centrality: Centrality.EDGE_CASE,
        explanation: "The systemic outcome when feedback loops override mitigation handles.",
        dataInsight: "1.5°C breach is now predicted within the next 5 years.",
        source: "WMO Report",
        category: "Outcome",
        specificityScore: 96
      }
    ],
    metrics: {
      cohesion: 85,
      coverage: 88,
      entropy: 55,
      sharpness: 90,
      explanation: "The board maps the physical drivers of climate variance and the systemic risks involved.",
      synthesis: "Climate variance is a deducible outcome of Carbon Concentration overriding Feedback Loops.",
      emergentPatterns: ["The 1.5°C Threshold", "Albedo Feedback"],
      links: [
        { source: "Carbon Concentration", target: "Temperature Anomalies", label: "Drives" },
        { source: "Temperature Anomalies", target: "Feedback Loops", label: "Triggers" }
      ],
      coverageBreakdown: { dominant: 50, present: 25, edgeCase: 25 },
      synthesisSuggestions: []
    }
  }
};
