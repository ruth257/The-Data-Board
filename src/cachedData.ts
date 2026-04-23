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
        specificityScore: 90,
        logic: `concept "Economic Security"
  is a: driver
  context: "Global life satisfaction predictors"
  mechanism: "financial stability reduces systemic distress and enables life choices"
  evidence: "GDP per capita correlation (r=0.82)"
  covers:
    explains: [life_satisfaction]
    aggregates: [gdp_per_capita]
    replaces: "Material wealth"
  relation:
    direction: upstream
    of: "Life Satisfaction"
    via: resource_access
  contrasts_with: "The Wealth Plateau"
  scope: global
  fidelity: 0.95
  fidelity_basis: empirical_test
  valid_when:
    - "market economies"
    - "basic needs met"`
      },
      {
        id: "h-2",
        word: "Social Cohesion",
        centrality: Centrality.DOMINANT,
        explanation: "The presence of someone to count on in times of trouble is the primary social driver.",
        dataInsight: "Social support accounts for 33% of the variance in national happiness averages.",
        source: "Gallup World Poll",
        category: "Social",
        specificityScore: 85,
        logic: `concept "Social Cohesion"
  is a: driver
  context: "Social support systems"
  mechanism: "trusted social networks provide emotional and material safety nets"
  evidence: "Gallup World Poll social support metrics"
  covers:
    explains: [national_happiness_variance]
    aggregates: [social_support_score]
    replaces: "Social capital"
  relation:
    direction: upstream
    of: "Life Satisfaction"
    via: emotional_security
  contrasts_with: "Atomized Autonomy"
  scope: global
  fidelity: 0.92
  fidelity_basis: empirical_test
  valid_when:
    - "strong community ties"
    - "institutional stability"`,
        cachedShadow: {
          id: "h-2-s",
          word: "Atomized Autonomy",
          centrality: Centrality.EDGE_CASE,
          explanation: "The tension where high individual freedom leads to social fragmentation and loneliness.",
          dataInsight: "Highly individualistic cultures show 15% higher reported loneliness despite high freedom scores.",
          source: "Sociological Audit",
          category: "Social",
          specificityScore: 92,
          logic: `concept "Atomized Autonomy"
  is a: risk
  context: "Individualistic social structures"
  mechanism: "extreme focus on self-reliance erodes communal support structures"
  evidence: "Loneliness metrics in individualistic cultures"
  covers:
    explains: [social_fragmentation]
    aggregates: [individualism_index]
    replaces: "Pure freedom"
  relation:
    direction: downstream
    of: "Individual Freedom"
    via: social_erosion
  contrasts_with: "Social Cohesion"
  scope: global
  fidelity: 0.88
  fidelity_basis: semantic_density
  valid_when:
    - "high individualism"
    - "weak community institutions"`
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
        specificityScore: 80,
        logic: `concept "Institutional Trust"
  is a: driver
  context: "Perceptions of corruption and governance"
  mechanism: "trust in institutions reduces systemic anxiety and enables long-term planning"
  evidence: "Transparency International corruption perception index"
  covers:
    explains: [freedom_to_make_choices]
    aggregates: [corruption_score]
    replaces: "Political stability"
  relation:
    direction: upstream
    of: "Life Satisfaction"
    via: systemic_predictability
  contrasts_with: "Systemic Corruption"
  scope: global
  fidelity: 0.90
  fidelity_basis: empirical_test
  valid_when:
    - "functioning state institutions"
    - "public accountability"`
      },
      {
        id: "h-4",
        word: "Individual Freedom",
        centrality: Centrality.PRESENT,
        explanation: "The autonomy to choose one's life path is a critical handle for high-ranking nations.",
        dataInsight: "Nordic countries score highest in this category, consistently leading the global index.",
        source: "World Happiness Report",
        category: "Rights",
        specificityScore: 75,
        logic: `concept "Individual Freedom"
  is a: driver
  context: "Autonomy in life choices"
  mechanism: "the ability to align life path with personal values drives psychological well-being"
  evidence: "World Happiness Report freedom metrics"
  covers:
    explains: [life_satisfaction_variance]
    aggregates: [autonomy_score]
    replaces: "Civil liberties"
  relation:
    direction: upstream
    of: "Life Satisfaction"
    via: self_actualization
  contrasts_with: "Structural Constraint"
  scope: global
  fidelity: 0.88
  fidelity_basis: empirical_test
  valid_when:
    - "legal protections for rights"
    - "social tolerance"`
      },
      {
        id: "h-5",
        word: "Systemic Distress",
        centrality: Centrality.EDGE_CASE,
        explanation: "The 'Shadow' of happiness: areas where high GDP fails to translate into well-being due to inequality.",
        dataInsight: "The 'Happiness Gap' between the top and bottom 20% is widening in 60% of surveyed nations.",
        source: "Gini Index Cross-Analysis",
        category: "Inequality",
        specificityScore: 85,
        logic: `concept "Systemic Distress"
  is a: risk
  context: "Inequality and its psychological impact"
  mechanism: "high inequality creates social comparison friction and erodes trust"
  evidence: "Happiness gap variance vs Gini index"
  covers:
    explains: [well_being_inequality]
    aggregates: [happiness_gap]
    replaces: "Poverty"
  relation:
    direction: downstream
    of: "Economic Security"
    via: unequal_distribution
  contrasts_with: "Economic Security"
  scope: global
  fidelity: 0.85
  fidelity_basis: semantic_density
  valid_when:
    - "high income inequality"
    - "low social mobility"`
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
  "big-mac-index": {
    tiles: [
      {
        id: "bm-1",
        word: "The Standard Burger",
        centrality: Centrality.DOMINANT,
        explanation: "The US Dollar price of a Big Mac serves as the global standard against which all other currencies are measured.",
        dataInsight: "The US price acts as the 'zero point' for calculating global purchasing power deviations.",
        source: "The Economist / GitHub Dataset",
        category: "Reference Standards",
        isAIConfirmed: true,
        relevanceScore: 98,
        specificityScore: 95,
        logic: `concept "The Standard Burger"
  is a: benchmark
  context: "Global currency valuation benchmark"
  mechanism: "it normalizes non-tradable local costs across 50+ countries"
  evidence: "The Economist Big Mac Index methodology"
  covers:
    explains: [dollar_valuation]
    aggregates: [local_price, dollar_ex]
    replaces: "Standard CPI basket"
  relation:
    direction: upstream
    of: "Currency Valuation"
    via: price_normalization
  contrasts_with: "Economic Arbitrage"
  scope: global
  fidelity: 0.98
  fidelity_basis: empirical_test
  valid_when:
    - "standardized product availability"
    - "market exchange rates exist"`
      },
      {
        id: "bm-2",
        word: "The Wealthy Surcharge",
        centrality: Centrality.DOMINANT,
        explanation: "The structural price increase observed in wealthy nations where higher wages and rents inflate the cost of standardized goods.",
        dataInsight: "High-GDP nations consistently show a 30-50% price premium over the global average.",
        source: "Economic Status Audit",
        category: "Economic Status",
        isAIConfirmed: true,
        relevanceScore: 96,
        specificityScore: 92,
        logic: `concept "The Wealthy Surcharge"
  is a: driver
  context: "High-income economy price dynamics"
  mechanism: "higher productivity in tradable sectors drives up non-tradable costs like rent and wages"
  evidence: "Balassa-Samuelson effect"
  covers:
    explains: [local_price]
    aggregates: [gdp_per_capita]
    replaces: "Linear GDP-Price correlation"
  relation:
    direction: upstream
    of: "The Standard Burger"
    via: cost_inflation
  contrasts_with: "The Emerging Discount"
  scope: global
  fidelity: 0.95
  fidelity_basis: empirical_test
  valid_when:
    - "high GDP per capita"
    - "significant non-tradable sector"`
      },
      {
        id: "bm-3",
        word: "The Emerging Discount",
        centrality: Centrality.DOMINANT,
        explanation: "The systemic undervaluation of currencies in emerging markets, making global goods appear cheaper in local terms.",
        dataInsight: "Currencies in developing regions are often undervalued by 40-60% relative to the dollar benchmark.",
        source: "Market Inequity Analysis",
        category: "Market Inequity",
        isAIConfirmed: true,
        relevanceScore: 94,
        specificityScore: 90,
        logic: `concept "The Emerging Discount"
  is a: discount
  context: "Developing market currency undervaluation"
  mechanism: "lower labor costs and currency pegs create a structural discount in global terms"
  evidence: "Market Inequity Analysis"
  covers:
    explains: [dollar_valuation]
    aggregates: [local_price]
    replaces: "Market exchange rate parity"
  relation:
    direction: downstream
    of: "The Standard Burger"
    via: valuation_gap
  contrasts_with: "The Wealthy Surcharge"
  scope: regional
  fidelity: 0.94
  fidelity_basis: semantic_density
  valid_when:
    - "developing economy status"
    - "currency undervaluation relative to PPP"`
      },
      {
        id: "bm-4",
        word: "Local Labor Anchor",
        centrality: Centrality.PRESENT,
        explanation: "The link between local productivity levels and the price of non-tradable inputs like labor and services.",
        dataInsight: "Explains why price convergence is limited by structural differences in national productivity.",
        source: "Structural Fundamentals",
        category: "Structural Fundamentals",
        isAIConfirmed: true,
        relevanceScore: 92,
        specificityScore: 88,
        logic: `concept "Local Labor Anchor"
  is a: structural
  context: "Productivity-wage linkage in non-tradable sectors"
  mechanism: "wages are the primary non-tradable component of the burger's price"
  evidence: "Structural Fundamentals Audit"
  covers:
    explains: [local_price]
    aggregates: [gdp_per_capita]
    replaces: "Global supply chain cost model"
  relation:
    direction: upstream
    of: "The Standard Burger"
    via: wage_pressure
  contrasts_with: "Global Supply Chain"
  scope: global
  fidelity: 0.92
  fidelity_basis: empirical_test
  valid_when:
    - "labor-intensive production"
    - "local wage variance"`
      },
      {
        id: "bm-5",
        word: "Market Lag",
        centrality: Centrality.PRESENT,
        explanation: "The resistance in exchange rates to adjust immediately to changes in local purchasing power.",
        dataInsight: "Market volatility creates temporary gaps between 'burger' value and 'fiat' value.",
        source: "Analysis Metrics",
        category: "Analysis Metrics",
        isAIConfirmed: true,
        relevanceScore: 90,
        specificityScore: 85,
        logic: `concept "Market Lag"
  is a: lag
  context: "Short-term exchange rate volatility vs long-term PPP"
  mechanism: "exchange rates react faster to capital flows than to consumer price parity"
  evidence: "Volatility Analysis"
  covers:
    explains: [dollar_ex]
    aggregates: [dollar_valuation]
    replaces: "Instantaneous PPP adjustment"
  relation:
    direction: downstream
    of: "The Standard Burger"
    via: temporal_friction
  contrasts_with: "Instant Parity"
  scope: dataset-specific
  fidelity: 0.88
  fidelity_basis: semantic_density
  valid_when:
    - "high market volatility"
    - "capital flow dominance"`
      },
      {
        id: "bm-6",
        word: "Neighboring Parity",
        centrality: Centrality.PRESENT,
        explanation: "The tendency for neighboring countries with similar economic profiles to share consistent price levels.",
        dataInsight: "Eurozone nations show high internal parity despite varying local labor costs.",
        source: "Geopolitical Groups",
        category: "Geopolitical Groups",
        isAIConfirmed: true,
        relevanceScore: 88,
        specificityScore: 82,
        logic: `concept "Neighboring Parity"
  is a: grouping
  context: "Regional economic integration and price stabilization"
  mechanism: "integrated markets and shared trade policies stabilize regional price variance"
  evidence: "Geopolitical Audit"
  covers:
    explains: [local_price]
    aggregates: [iso_code]
    replaces: "Isolated national price models"
  relation:
    direction: upstream
    of: "Market Lag"
    via: regional_stability
  contrasts_with: "Isolated Volatility"
  scope: regional
  fidelity: 0.85
  fidelity_basis: expert_judgment
  valid_when:
    - "regional trade agreements"
    - "geographic proximity"`
      },
      {
        id: "bm-7",
        word: "Supply Chain Friction",
        centrality: Centrality.EDGE_CASE,
        explanation: "Outliers where local supply chain failures or extreme taxes decouple the price from economic fundamentals.",
        dataInsight: "Observed in markets with high import tariffs or hyper-local logistics bottlenecks.",
        source: "Outlier Detection",
        category: "Outlier Detection",
        isAIConfirmed: true,
        relevanceScore: 85,
        specificityScore: 95,
        logic: `concept "Supply Chain Friction"
  is a: friction
  context: "Non-economic price distortions (tariffs, logistics)"
  mechanism: "artificial barriers like tariffs override standard economic drivers"
  evidence: "Outlier Detection Audit"
  covers:
    explains: [local_price]
    aggregates: [dollar_price]
    replaces: "Frictionless trade assumption"
  relation:
    direction: upstream
    of: "The Standard Burger"
    via: price_distortion
  contrasts_with: "Free Trade Flow"
  scope: dataset-specific
  fidelity: 0.90
  fidelity_basis: empirical_test
  valid_when:
    - "high import tariffs"
    - "logistical bottlenecks"`
      },
      {
        id: "bm-8",
        word: "Policy Gap",
        centrality: Centrality.EDGE_CASE,
        explanation: "The extreme decoupling of a currency's market value from its actual purchasing power due to policy intervention.",
        dataInsight: "Significant in nations with artificial currency pegs or capital controls.",
        source: "Currency Risk",
        category: "Currency Risk",
        isAIConfirmed: true,
        relevanceScore: 82,
        specificityScore: 92,
        logic: `concept "Policy Gap"
  is a: gap
  context: "Central bank intervention and capital controls"
  mechanism: "central bank intervention creates a deducible gap between market and real value"
  evidence: "Currency Risk Audit"
  covers:
    explains: [dollar_ex]
    aggregates: [dollar_valuation]
    replaces: "Free-floating currency model"
  relation:
    direction: downstream
    of: "The Standard Burger"
    via: policy_intervention
  contrasts_with: "Market Transparency"
  scope: dataset-specific
  fidelity: 0.92
  fidelity_basis: expert_judgment
  valid_when:
    - "capital controls in place"
    - "managed float or fixed peg"`
      }
    ],
    metrics: {
      cohesion: 94,
      coverage: 92,
      entropy: 35,
      sharpness: 96,
      explanation: "The board successfully maps the tension between global benchmarks and local market inequities.",
      synthesis: "Global currency valuation is a structural outcome of the tension between The Standard Burger and The Emerging Discount.",
      emergentPatterns: ["The Wealthy Surcharge", "Policy Gap Risks"],
      links: [
        { source: "The Standard Burger", target: "The Wealthy Surcharge", label: "Measures" },
        { source: "The Emerging Discount", target: "Policy Gap", label: "Predicts" }
      ],
      synthesisSuggestions: []
    }
  }
};
