import { Tile, Centrality, BoardMetrics } from "./types";

export const CACHED_BOARDS: Record<string, { tiles: Tile[], metrics: BoardMetrics, cachedExpansion?: Tile[] }> = {
  "world-happiness-2025": {
    tiles: [
      {
        id: "h-1",
        word: "Economic Security",
        centrality: Centrality.DOMINANT,
        explanation: "The foundation of stability; having enough financial resources to cover basic needs and plan for the future.",
        dataInsight: "Evidence: GDP per capita remains the strongest predictor of national happiness levels across all income brackets.",
        source: "World Happiness Report 2025 / Gallup",
        category: "Economics",
        specificityScore: 94,
        logic: `concept "Economic Security"
  is a: baseline
  context: "Capacity for choice vs raw wealth"
  mechanism: "financial liquidity provides a buffer against external shocks and enables life alignment"
  evidence: "Linear correlation between GDP per capita and Cantril Ladder scores"
  covers:
    explains: [life_satisfaction_floor]
    aggregates: [gdp_per_capita]
    replaces: "Material Agency"
  relation:
    direction: upstream
    of: "Life Satisfaction"
    via: resource_access
  contrasts_with: "Systemic Poverty"
  scope: global
  fidelity: 0.96`
      },
      {
        id: "h-2",
        word: "Social Support",
        centrality: Centrality.DOMINANT,
        explanation: "The presence of a reliable network of family and friends to count on during times of trouble.",
        dataInsight: "Evidence: Having someone to count on explains 33% of the happiness variance between nations.",
        source: "Gallup World Poll / Trust Audit",
        category: "Social",
        specificityScore: 88,
        logic: `concept "Social Support"
  is a: buffer
  context: "Communal safety nets"
  mechanism: "trusted social networks reduce the psychological burden of crisis and improve recovery speed"
  evidence: "Gallup 'Social Support' metric (Someone to count on)"
  covers:
    explains: [national_resilience]
    aggregates: [social_support_score]
    replaces: "Social Cohesion"
  relation:
    direction: upstream
    of: "Emotional Security"
    via: relational_density
  contrasts_with: "Social Isolation"
  scope: global
  fidelity: 0.93`
      },
      {
        id: "h-3",
        word: "Trust in Governance",
        centrality: Centrality.PRESENT,
        explanation: "The belief that public institutions are honest and free from widespread corruption.",
        dataInsight: "Evidence: Low corruption scores are a prerequisite for individuals feeling 'free to make life choices'.",
        source: "Transparency International / WHR 2025",
        category: "Governance",
        specificityScore: 90,
        logic: `concept "Trust in Governance"
  is a: foundation
  context: "Predictability of social contract"
  mechanism: "transparent institutions reduce systemic anxiety and improve collective cooperation"
  evidence: "Corruption Perceptions Index vs WHR Scores"
  covers:
    explains: [institutional_trust]
    aggregates: [corruption_score]
    replaces: "Institutional Trust"
  relation:
    direction: upstream
    of: "Systemic Agency"
    via: rule_of_law
  contrasts_with: "Governance Breakdown"
  scope: global
  fidelity: 0.91`
      },
      {
        id: "h-4",
        word: "Healthy Longevity",
        centrality: Centrality.PRESENT,
        explanation: "A combination of long life and the physical health required to enjoy it without chronic disability.",
        dataInsight: "Evidence: A one-year gain in healthy life expectancy is statistically as powerful as a 10% income increase.",
        source: "WHO / World Happiness Report 2025",
        category: "Health",
        specificityScore: 85,
        logic: `concept "Healthy Longevity"
  is a: prerequisite
  context: "Physical capacity for life satisfaction"
  mechanism: "absence of chronic pain and mobility limits enables active participation in society"
  evidence: "WHO Healthy Life Expectancy (HALE) metrics"
  covers:
    explains: [long_term_well_being]
    aggregates: [healthy_life_expectancy]
    replaces: "Biological Baseline"
  relation:
    direction: upstream
    of: "Life Satisfaction"
    via: physical_agency
  contrasts_with: "Chronic Illness"
  scope: global
  fidelity: 0.94`
      },
      {
        id: "h-5",
        word: "Freedom to Choose",
        centrality: Centrality.EDGE_CASE,
        explanation: "The ability for individuals to determine their own life path, career, and personal values.",
        dataInsight: "Evidence: While high freedom correlates with happiness, it can lead to anxiety if not supported by economic security.",
        source: "Psychological Audit / WHR 2025",
        category: "Rights",
        specificityScore: 92,
        logic: `concept "Freedom to Choose"
  is a: driver
  context: "Autonomy in life decisions"
  mechanism: "the capacity to align personal values with action reduces psychological friction"
  evidence: "Gallup 'Freedom to make life choices' metric"
  covers:
    explains: [life_autonomy]
    aggregates: [freedom_score]
    replaces: "Optionality Drift"
  relation:
    direction: downstream
    of: "Economic Security"
    via: choice_capability
  contrasts_with: "Restricted Autonomy"
  scope: global
  fidelity: 0.89`
      }
    ],
    cachedExpansion: [
      {
        id: "h-exp-1",
        word: "Cultural Anchoring",
        centrality: Centrality.DOMINANT,
        explanation: "The role of shared traditional values in providing existential meaning and community resilience.",
        dataInsight: "Nations with strong cultural anchoring report 12% higher 'meaning in life' scores despite economic variance.",
        source: "World Values Survey",
        category: "Culture",
        specificityScore: 90,
        logic: `concept "Cultural Anchoring"
  is a: stabilizer
  context: "Existential meaning structures"
  mechanism: "shared narratives and rituals provide a psychological buffer against societal change"
  evidence: "Religiosity/Tradition scores vs happiness indices"
  covers:
    explains: [existential_stability]
    aggregates: [cultural_values]
    replaces: "Religiosity"
  relation:
    direction: upstream
    of: "Social Cohesion"
    via: shared_meaning
  contrasts_with: "Digital Fragmentation"
  scope: global
  fidelity: 0.91`
      },
      {
        id: "h-exp-2",
        word: "Digital Fragmentation",
        centrality: Centrality.PRESENT,
        explanation: "The erosion of physical social cohesion through hyper-individualized digital consumption.",
        dataInsight: "For every 10% increase in average daily screen time, social trust scores drop by 3.5 points.",
        source: "Digital Life Audit / WHR 2025",
        category: "Technology",
        specificityScore: 88,
        logic: `concept "Digital Fragmentation"
  is a: risk
  context: "Social side-effects of digital immersion"
  mechanism: "algorithmic sorting reduces shared physical experiences and erodes local social trust"
  evidence: "Daily internet usage vs social cohesion metrics"
  covers:
    explains: [social_atomization]
    aggregates: [screen_time_averages]
    replaces: "Internet penetration"
  relation:
    direction: downstream
    of: "Social Cohesion"
    via: community_erosion
  contrasts_with: "Social Cohesion"
  scope: global
  fidelity: 0.89`
      },
      {
        id: "h-exp-3",
        word: "The Agency-Resource Gap",
        centrality: Centrality.EDGE_CASE,
        explanation: "The structural tension between formal individual rights and the material resources needed to act on them.",
        dataInsight: "Freedom scores in low-GDP nations show a 0.45 correlation with life satisfaction, compared to 0.85 in high-GDP nations.",
        source: "Socio-Economic Audit",
        category: "Rights",
        specificityScore: 95,
        logic: `concept "The Agency-Resource Gap"
  is a: tension
  context: "Hollow vs functional freedom"
  mechanism: "formal rights are psychologically hollow without the economic agency to exercise them"
  evidence: "Freedom score vs income deciles (Global South vs North)"
  covers:
    explains: [hollow_autonomy]
    aggregates: [freedom_score, gdp_per_capita]
    replaces: "Civil liberties"
  relation:
    direction: downstream
    of: "Material Agency"
    via: potential_restriction
  contrasts_with: "Material Agency"
  scope: global
  fidelity: 0.94`
      }
    ],
    metrics: {
      cohesion: 94,
      coverage: 92,
      entropy: 35,
      sharpness: 96,
      explanation: "The board successfully maps the tension between economic security and the social support required to sustain it.",
      synthesis: "Global well-being is a structural outcome of the balance between Economic Security and Social Support.",
      emergentPatterns: ["The Nordic Stability Cycle", "Security-Choice Tension"],
      links: [
        { source: "Economic Security", target: "Social Support", label: "Pairs with" },
        { source: "Trust in Governance", target: "Economic Security", label: "Foundations" },
        { source: "Healthy Longevity", target: "Economic Security", label: "Prerequisite" }
      ],
      synthesisSuggestions: []
    }
  },
  "ai-sustainability-kaggle": {
    tiles: [
      {
        id: "ai-1",
        word: "Algorithmic Gluttony",
        centrality: Centrality.DOMINANT,
        explanation: "The exponential expansion of parameter counts and FLOPs, where model scale is prioritized over structural efficiency.",
        dataInsight: "Evidence: Frontier models now exceed 10^26 FLOPs in training runs, doubling precisely every 6 months (Epoch AI Database).",
        source: "Epoch AI Database",
        category: "Technical",
        specificityScore: 98,
        logic: `concept "Algorithmic Gluttony"
  is a: driver
  context: "SOTA scaling laws"
  mechanism: "brute-force scaling of parameters is the current path to emergent reasoning capabilities"
  evidence: "Training compute scaling tracks with benchmark performance"
  covers:
    explains: [carbon_footprint]
    aggregates: [parameter_count]
    replaces: "Compute intensity"
  relation:
    direction: upstream
    of: "Thermodynamic Ceiling"
    via: scale_pressure
  contrasts_with: "Structural Elegance"
  scope: global
  fidelity: 0.98`,
        cachedShadow: {
          id: "ai-1-s",
          word: "Structural Elegance",
          centrality: Centrality.PRESENT,
          explanation: "The counter-movement: efficient architectures like MoE (Mixture of Experts) that decouple reasoning quality from compute density.",
          dataInsight: "Evidence: MoE architectures can reduce active 'per-token' parameters by 90% without accuracy loss (DeepMind Research).",
          source: "DeepMind Research",
          category: "Software",
          specificityScore: 94
        }
      },
      {
        id: "ai-2",
        word: "Thermodynamic Ceiling",
        centrality: Centrality.DOMINANT,
        explanation: "The physical limit of TFLOPS per Watt and the heat dissipation capacity of modern high-density silicone clusters.",
        dataInsight: "Evidence: High-density H100 clusters generate heat levels requiring liquid cooling at scale; total consumption rising 20% YoY despite per-chip gains.",
        source: "NVIDIA Sustainability Audit",
        category: "Hardware",
        specificityScore: 92,
        logic: `concept "Thermodynamic Ceiling"
  is a: constraint
  context: "Data center power and thermal density"
  mechanism: "physical heat and power delivery limits create a maximum throughput per square foot"
  evidence: "Cluster thermal throttling reports"
  covers:
    explains: [facility_bottlenecks]
    aggregates: [power_usage_effectiveness]
    replaces: "Energy efficiency"
  relation:
    direction: downstream
    of: "Algorithmic Gluttony"
    via: thermal_debt
  contrasts_with: "Scaling Unlimited"
  scope: global
  fidelity: 0.95`,
        cachedShadow: {
          id: "ai-2-s",
          word: "Jevons Paradox",
          centrality: Centrality.EDGE_CASE,
          explanation: "The efficiency trap: 2x chip efficiency leads to 4x workload demand, worsening the total carbon trajectory.",
          dataInsight: "Evidence: Historic GPU trends show that every efficiency breakthrough lowers inference cost, inducing massive new request volumes.",
          source: "Economic Foundation Audit",
          category: "Economics",
          specificityScore: 97
        }
      },
      {
        id: "ai-3",
        word: "Deployment Fever",
        centrality: Centrality.PRESENT,
        explanation: "The market-driven imperative to ship models immediately, prioritizing release cycles over energy-optimization tuning.",
        dataInsight: "Evidence: Average time between model training completion and release has compressed from 18 months to 4 months (Kaggle Trends).",
        source: "Market Velocity Report",
        category: "Market",
        isAIConfirmed: true,
        relevanceScore: 88,
        specificityScore: 85,
        logic: `concept "Deployment Fever"
  is a: market_driver
  context: "Competitive model release cycles"
  mechanism: "first-to-market advantage forces premature deployment of non-optimized weights"
  evidence: "Time-to-market vs checkpoint optimization analysis"
  covers:
    explains: [inefficient_deployment]
    aggregates: [release_frequency]
    replaces: "Innovation velocity"
  relation:
    direction: upstream
    of: "Optimization Lag"
    via: market_priority
  contrasts_with: "Measured Maturation"
  scope: global
  fidelity: 0.90`
      },
      {
        id: "ai-4",
        word: "Gridlocked Ambition",
        centrality: Centrality.PRESENT,
        explanation: "The decoupling of AI demand from actual electrical grid capacity, where cluster plans exceed historical grid load growth.",
        dataInsight: "Evidence: 2024 IEA report identifies grid capacity as the primary bottleneck for 65% of planned hyperscale clusters.",
        source: "IEA Electricity Audit 2024",
        category: "Environment",
        isAIConfirmed: true,
        relevanceScore: 92,
        specificityScore: 89,
        logic: `concept "Gridlocked Ambition"
  is a: block
  context: "Infrastructure-Demand mismatch"
  mechanism: "AI cluster energy requirements grow 10x faster than national grid updates"
  evidence: "Utility interconnection queue wait times"
  covers:
    explains: [deployment_delays]
    replaces: "Carbon constraint"
  relation:
    direction: downstream
    of: "Algorithmic Gluttony"
    via: load_saturation
  contrasts_with: "Nuclear Integration"
  scope: global
  fidelity: 0.94`
      },
      {
        id: "ai-5",
        word: "Obsolescence Drift",
        centrality: Centrality.EDGE_CASE,
        explanation: "The systemic 'Toxicity' of software: models that become environmentally redundant before their training energy is amortized.",
        dataInsight: "Evidence: 70% of open-source models on major hubs see zero aggregate use after 90 days of release (HuggingFace Metrics).",
        source: "HuggingFace Metrics",
        category: "Lifecycle",
        isAIConfirmed: true,
        relevanceScore: 78,
        specificityScore: 92,
        logic: `concept "Obsolescence Drift"
  is a: risk
  context: "Model lifecycle and utility"
  mechanism: "continuous release of marginally better models renders previous state-of-the-art energy investments invalid"
  evidence: "Downstream fine-tuning activity decay"
  covers:
    explains: [wasted_compute]
    replaces: "Data toxicity"
  relation:
    direction: downstream
    of: "Deployment Fever"
    via: utility_decay
  contrasts_with: "Durable Intelligence"
  scope: global
  fidelity: 0.88`
      }
    ],
    cachedExpansion: [
      {
        id: "ai-exp-1",
        word: "Physical Obsolescence",
        centrality: Centrality.DOMINANT,
        explanation: "The rapid hardware turnover in AI clusters where GPUs reach technical EOL within 1000 days of deployment.",
        dataInsight: "Evidence: High-intensity GPU clusters show failure rates increasing significantly after 36 months of 24/7 load.",
        source: "Hyperscale Fleet Audit",
        category: "Hardware",
        specificityScore: 96,
        logic: `concept "Physical Obsolescence"
  is a: constraint
  context: "Hardware e-waste cycle"
  mechanism: "high-compute loads accelerate silicone degradation, forcing rapid replacements"
  evidence: "GPU MTBF data in data centers"
  covers:
    explains: [e_waste_volume]
    replaces: "Hardware Lifecycle"
  relation:
    direction: downstream
    of: "Algorithmic Gluttony"
    via: hardware_burnrate
  contrasts_with: "Silicone Longevity"
  scope: global
  fidelity: 0.94`
      },
      {
        id: "ai-exp-2",
        word: "Intelligence Thinning",
        centrality: Centrality.PRESENT,
        explanation: "The shift toward 'Distillation' where massive teacher models are compressed into lightweight edge-ready student models.",
        dataInsight: "Evidence: 8-billion parameter distilled models approaching GPT-4 benchmarks in specific reasoning tasks.",
        source: "Model Compression Benchmarks",
        category: "Software",
        specificityScore: 93,
        logic: `concept "Intelligence Thinning"
  is a: lever
  context: "Inference efficiency gains"
  mechanism: "distilling knowledge into smaller parameter counts to reduce the per-inference energy cost"
  evidence: "Accuracy vs parameter count scaling"
  covers:
    explains: [inference_energy]
    replaces: "Model Distillation"
  relation:
    direction: downstream
    of: "Structural Elegance"
    via: edge_optimization
  contrasts_with: "Algorithmic Gluttony"
  scope: global
  fidelity: 0.95`
      },
      {
        id: "ai-exp-3",
        word: "Compute Sovereignty",
        centrality: Centrality.EDGE_CASE,
        explanation: "The geopolitical tension of 'Cloud Protectionism'—nations securing localized energy and compute reserves.",
        dataInsight: "Evidence: Rise in national sovereignty-focused compute clusters (e.g., UAE, France) decoupling from global centralized providers.",
        source: "Strategic Policy Report",
        category: "Policy",
        specificityScore: 97,
        logic: `concept "Compute Sovereignty"
  is a: risk
  context: "Geopolitical compute access"
  mechanism: "fragmentation of the energy and chip supply chain as national safety overrides global market efficiency"
  evidence: "Sovereign AI initiatives volume"
  covers:
    explains: [energy_protectionism]
  relation:
    direction: downstream
    of: "Gridlocked Ambition"
    via: strategic_hoarding
  contrasts_with: "Global Cloud Utility"
  scope: global
  fidelity: 0.96`
      }
    ],
    metrics: {
      cohesion: 96,
      coverage: 92,
      entropy: 30,
      sharpness: 98,
      explanation: "The board successfully maps the collision between algorithmic ambition and the hard thermodynamic reality of energy and hardware limits.",
      synthesis: "AI Sustainability is a structural conflict between Algorithmic Gluttony and Thermodynamic Ceiling, moderated by Intelligence Thinning.",
      emergentPatterns: ["The Efficiency Paradox", "Infrastructure Saturation"],
      links: [
        { source: "Algorithmic Gluttony", target: "Thermodynamic Ceiling", label: "Violates" },
        { source: "Structural Elegance", target: "Intelligence Thinning", label: "Enables" },
        { source: "Deployment Fever", target: "Obsolescence Drift", label: "Accelerates" }
      ],
      synthesisSuggestions: []
    }
  },
  "gss-life-survey": {
    tiles: [
      {
        id: "gss-1",
        word: "Marital Stability",
        centrality: Centrality.DOMINANT,
        explanation: "The stabilizing effect of long-term committed relationships as a primary social anchor for American adults.",
        dataInsight: "Evidence: Married individuals consistently report 18% higher happiness scores across five decades of GSS data.",
        source: "GSS Longitudinal Tracking 1972-2024",
        category: "Demographics",
        specificityScore: 96,
        logic: `concept "Marital Stability"
  is a: stabilizer
  context: "Relational foundations of well-being"
  mechanism: "shared long-term commitments provide a psychological and economic buffer against life shocks"
  evidence: "Marital status vs 'Very Happy' reports (1972-2024)"
  covers:
    explains: [relational_stability]
    aggregates: [marital_status]
    replaces: "Communal Anchoring"
  relation:
    direction: upstream
    of: "Life Satisfaction"
    via: status_certainty
  contrasts_with: "Social Isolation"
  scope: regional
  fidelity: 0.97`
      },
      {
        id: "gss-2",
        word: "Personal Health",
        centrality: Centrality.DOMINANT,
        explanation: "The individual's perception of their physical well-being as a requisite for basic life quality.",
        dataInsight: "Evidence: Moving from 'Fair' to 'Excellent' health is equivalent to a massive $100k increase in household income satisfaction.",
        source: "GSS Health Module / CDC",
        category: "Health",
        specificityScore: 94,
        logic: `concept "Personal Health"
  is a: prerequisite
  context: "Capacity for participation in society"
  mechanism: "good health enables vocational pursuit and social engagement"
  evidence: "Self-rated health vs happiness deciles"
  covers:
    explains: [functional_agency]
    aggregates: [health_status]
    replaces: "Physical Fidelity"
  relation:
    direction: upstream
    of: "Job Satisfaction"
    via: physical_capacity
  contrasts_with: "Health Decline"
  scope: regional
  fidelity: 0.95`
      },
      {
        id: "gss-3",
        word: "Financial Satisfaction",
        centrality: Centrality.PRESENT,
        explanation: "How individuals feel about their financial standing relative to their needs and local peer groups.",
        dataInsight: "Evidence: Relative financial standing predicts happiness more accurately than absolute dollar income levels.",
        source: "GSS Economic Outlook",
        category: "Economics",
        specificityScore: 88,
        logic: `concept "Financial Satisfaction"
  is a: tension
  context: "Relative vs absolute economic standing"
  mechanism: "social comparison at the local level drives satisfaction more than absolute wealth"
  evidence: "Income decile vs 'satisfied with finances' scores"
  covers:
    explains: [economic_contentment]
    aggregates: [household_income, relative_status]
    replaces: "Comparative Affluence"
  relation:
    direction: downstream
    of: "Marital Stability"
    via: relative_status
  contrasts_with: "Economic Distress"
  scope: regional
  fidelity: 0.92`
      },
      {
        id: "gss-4",
        word: "Job Satisfaction",
        centrality: Centrality.PRESENT,
        explanation: "The degree of fulfillment and purpose derived from one's professional life and daily work.",
        dataInsight: "Evidence: Meaningful work remains a top-3 predictor of happiness for American adults across all cohorts.",
        source: "GSS Labor Module / BLS",
        category: "Career",
        specificityScore: 85,
        logic: `concept "Job Satisfaction"
  is a: driver
  context: "Purpose-driven professional identity"
  mechanism: "professional contribution provides identity, status, and social connection"
  evidence: "Job satisfaction vs overall happiness correlation"
  covers:
    explains: [professional_fulfillment]
    aggregates: [work_status, job_satisfaction]
    replaces: "Vocational Gravity"
  relation:
    direction: downstream
    of: "Personal Health"
    via: labor_participation
  contrasts_with: "Work Burnout"
  scope: regional
  fidelity: 0.90`
      },
      {
        id: "gss-5",
        word: "Social Isolation",
        centrality: Centrality.EDGE_CASE,
        explanation: "A lack of close friends or confidants; the rising 'Zero Friends' phenomenon in modern life.",
        dataInsight: "Evidence: The number of Americans reporting 'no close friends' has tripled since 1985.",
        source: "GSS Social Network Audit",
        category: "Social",
        specificityScore: 95,
        logic: `concept "Social Isolation"
  is a: risk
  context: "Loss of communal safety nets"
  mechanism: "erosion of traditional social hubs leads to individual atomization"
  evidence: "Confidant network size longitudinal data"
  covers:
    explains: [loneliness_episodes]
    aggregates: [social_isolation_metrics]
    replaces: "The Confidant Void"
  relation:
    direction: downstream
    of: "Marital Stability"
    via: social_atomization
  contrasts_with: "Marital Stability"
  scope: regional
  fidelity: 0.94`
      }
    ],
    cachedExpansion: [
      {
        id: "gss-exp-1",
        word: "Educational Mobility",
        centrality: Centrality.DOMINANT,
        explanation: "The primary handle for socio-economic ascent and status in the GSS data.",
        dataInsight: "The happiness gap between degree holders and non-holders has widened by 15% since the 1990s.",
        source: "GSS Education Module / Socio-Economic Audit",
        category: "Education",
        specificityScore: 93,
        logic: `concept "Educational Mobility"
  is a: lever
  context: "Access to the status-happiness loop"
  mechanism: "credentials expand long-term optionality and provide access to high-trust professional networks"
  evidence: "GSS degree status vs happiness deciles over 40 years"
  covers:
    explains: [status_mobility]
    aggregates: [degree_level]
    replaces: "IQ / Skill"
  relation:
    direction: upstream
    of: "Job Satisfaction"
    via: credential_inflation
  contrasts_with: "Labor Exclusion"
  scope: regional
  fidelity: 0.94`
      },
      {
        id: "gss-exp-2",
        word: "Shared Community",
        centrality: Centrality.PRESENT,
        explanation: "The traditional handle for communal identity and existential stability (Religion and groups).",
        dataInsight: "Participation in community groups provides a 10% happiness premium that persists even when controlling for income.",
        source: "GSS Community Module / Psychology of Meaning",
        category: "Culture",
        specificityScore: 89,
        logic: `concept "Shared Community"
  is a: buffer
  context: "Communal belief frameworks"
  mechanism: "participation in ritualized shared meaning reduces the existential dread of modern atomization"
  evidence: "Attendance frequency vs reported 'Joy in life'"
  covers:
    explains: [existential_resilience]
    aggregates: [church_attendance]
    replaces: "Shared Meaning"
  relation:
    direction: upstream
    of: "Marital Stability"
    via: moral_norming
  contrasts_with: "Social Isolation"
  scope: regional
  fidelity: 0.89`
      },
      {
        id: "gss-exp-3",
        word: "Political Polarization",
        centrality: Centrality.EDGE_CASE,
        explanation: "The erosion of interpersonal trust through widening ideological divides.",
        dataInsight: "The 'Social Trust' score in GSS is at a record low in highly polarized political districts.",
        source: "GSS Political Audit / Pew Research",
        category: "Ideology",
        specificityScore: 95,
        logic: `concept "Political Polarization"
  is a: risk
  context: "The cost of ideological sorting"
  mechanism: "out-group hostility erodes the foundations of neighborly trust and local social capital"
  evidence: "Social trust scores vs partisan density"
  covers:
    explains: [trust_decay]
    aggregates: [political_affiliation]
    replaces: "Partisan Friction"
  relation:
    direction: downstream
    of: "Marital Stability"
    via: affective_polarization
  contrasts_with: "Marital Stability"
  scope: regional
  fidelity: 0.91`
      }
    ],
    metrics: {
      cohesion: 92,
      coverage: 95,
      entropy: 38,
      sharpness: 94,
      explanation: "The GSS board provides a long-term view of the structural pillars of American life satisfaction, focusing on anchors vs. drift.",
      synthesis: "Life satisfaction is a deducible outcome of the interaction between Marital Stability and Personal Health.",
      emergentPatterns: ["The Decoupled Affluence Trap", "Total Social Atomization"],
      links: [
        { source: "Marital Stability", target: "Personal Health", label: "Dual Reinforcement" },
        { source: "Job Satisfaction", target: "Personal Health", label: "Dependent on" },
        { source: "Marital Stability", target: "Social Isolation", label: "Pseudo-Antonym" }
      ],
      coverageBreakdown: { dominant: 40, present: 40, edgeCase: 20 },
      synthesisSuggestions: []
    }
  },
  "big-mac-index": {
    tiles: [
      {
        id: "bm-2",
        word: "The Wealthy Surcharge",
        centrality: Centrality.DOMINANT,
        explanation: "The systematic price premium in high-GDP nations where high productivity in tradables inflates the cost of local non-tradable services.",
        dataInsight: "Evidence: Switzerland and Norway consistently sit 30-50% above the global regression line for burger prices.",
        source: "The Economist / GDP-Price Audit",
        category: "Economic Status",
        isAIConfirmed: true,
        relevanceScore: 98,
        specificityScore: 96,
        logic: `concept "The Wealthy Surcharge"
  is a: driver
  context: "High-income economy price dynamics"
  mechanism: "higher productivity in tradable sectors drives up non-tradable costs like local labor and rent"
  evidence: "Swiss and Nordic clusters in the Big Mac dataset"
  covers:
    explains: [local_price_premium]
    aggregates: [gdp_per_capita]
    replaces: "The Wealthy Surcharge"
  relation:
    direction: upstream
    of: "Purchasing Power Parity"
    via: Balassa-Samuelson_effect
  contrasts_with: "The Emerging Discount"
  scope: global
  fidelity: 0.98`,
        cachedShadow: {
            id: "bm-2-s",
            word: "Structural Fragility",
            centrality: Centrality.PRESENT,
            explanation: "The vulnerability of high-price markets to supply chain shocks that bypass standard PPP mechanisms.",
            dataInsight: "Evidence: Observed price spikes in highly developed island nations (e.g., Iceland) that decouple from GDP benchmarks.",
            source: "Logistics Audit",
            category: "Economics",
            specificityScore: 92
        }
      },
      {
        id: "bm-3",
        word: "The Emerging Discount",
        centrality: Centrality.DOMINANT,
        explanation: "The structural undervaluation of currencies in developing markets, where low labor costs create a massive discount relative to the US dollar benchmark.",
        dataInsight: "Evidence: Nations like Egypt, Vietnam, and India show clusters of 40-60% undervaluation relative to the dollar benchmark.",
        source: "Market Inequity Analysis",
        category: "Market Inequity",
        isAIConfirmed: true,
        relevanceScore: 96,
        specificityScore: 94,
        logic: `concept "The Emerging Discount"
  is a: stabilizer
  context: "Developing market valuation"
  mechanism: "lower labor intensity and export-oriented currency policy create an artificial price floor"
  evidence: "Undervaluation clusters (Egypt, Vietnam, India) below the PPP trend line"
  covers:
    explains: [dollar_gap]
    replaces: "Market exchange rate"
  relation:
    direction: downstream
    of: "The Wealthy Surcharge"
    via: value_asymmetry
  contrasts_with: "The Wealthy Surcharge"
  scope: regional
  fidelity: 0.97`
      },
      {
        id: "bm-4",
        word: "Local Labor Anchor",
        centrality: Centrality.PRESENT,
        explanation: "The stubborn link between domestic productivity and the cost of the primarily non-tradable inputs (service labor) in a burger.",
        dataInsight: "Evidence: Minimal price convergence in services (labor/rent) despite globalized costs for physical buns or meat.",
        source: "Structural Fundamentals",
        category: "Structural Fundamentals",
        isAIConfirmed: true,
        relevanceScore: 92,
        specificityScore: 90,
        logic: `concept "Local Labor Anchor"
  is a: structural_link
  context: "Service sector wage pressure"
  mechanism: "wages in the service sector move with local productivity, anchoring prices to national rather than global benchmarks"
  evidence: "Service-to-Commodity price ratio variance in the index dataset"
  covers:
    explains: [price_persistence]
  relation:
    direction: upstream
    of: "The Wealthy Surcharge"
    via: wage_inertia
  contrasts_with: "The Commodity Floor"
  scope: global
  fidelity: 0.92`
      },
      {
        id: "bm-5",
        word: "Monetary Inertia",
        centrality: Centrality.PRESENT,
        explanation: "The temporal gap where exchange rates resist immediate adjustment to changes in local purchasing power, creating temporary 'Value Pockets'.",
        dataInsight: "Evidence: Countries like Turkey or Argentina show exchange rates reacting to capital flows 10x faster than to burger price parity.",
        source: "Analysis Metrics",
        category: "Analysis Metrics",
        isAIConfirmed: true,
        relevanceScore: 90,
        specificityScore: 88,
        logic: `concept "Monetary Inertia"
  is a: lag
  context: "Short-term FX volatility"
  mechanism: "capital flight and interest rate spreads dominate exchange rates in the short term, bypassing PPP"
  evidence: "Temporal lag in hyper-volatile markets (Argentina, Turkey)"
  covers:
    explains: [short_term_undervaluation]
    replaces: "Market Lag"
  relation:
    direction: downstream
    of: "The Emerging Discount"
    via: speculative_friction
  contrasts_with: "Instant Parity"
  scope: global
  fidelity: 0.91`
      },
      {
        id: "bm-6",
        word: "Integrated Parity",
        centrality: Centrality.PRESENT,
        explanation: "The tendency for nations within shared trade blocs (like the Eurozone) to maintain near-zero variance in standardized good prices.",
        dataInsight: "Evidence: Internal Eurozone price variance for the Big Mac is <5%, despite significant variance in local GDP.",
        source: "Geopolitical Groups",
        category: "Geopolitical Groups",
        isAIConfirmed: true,
        relevanceScore: 92,
        specificityScore: 85,
        logic: `concept "Integrated Parity"
  is a: stabilizer
  context: "Trade bloc price convergence"
  mechanism: "market integration and shared regulatory frameworks force price transparency and competition"
  evidence: "Eurozone price distribution clustering"
  covers:
    explains: [regional_price_clusters]
    replaces: "Neighboring Parity"
  relation:
    direction: upstream
    of: "Monetary Inertia"
    via: market_fluidity
  contrasts_with: "Policy Isolation"
  scope: regional
  fidelity: 0.94`
      },
      {
        id: "bm-7",
        word: "Logistical Premia",
        centrality: Centrality.EDGE_CASE,
        explanation: "Non-economic price spikes caused by local import tariffs (beef/wheat) or severe logistical bottlenecks.",
        dataInsight: "Evidence: Israel and Brazil appear as outliers where non-economic overhead keeps prices high relative to their GDP trend.",
        source: "Outlier Detection",
        category: "Trade Barriers",
        isAIConfirmed: true,
        relevanceScore: 92,
        specificityScore: 95,
        logic: `concept "Logistical Premia"
  is a: distortion
  context: "Trade barriers and supply chain overhead"
  mechanism: "artificial overheads (tariffs) override the expected correlation between local productivity and price"
  evidence: "Outlier status of Israel and Brazil in retail price variance"
  replaces: "Supply Chain Friction"
  relation:
    direction: upstream
    of: "The Wealthy Surcharge"
    via: tariff_loading
  contrasts_with: "Integrated Parity"
  scope: regional
  fidelity: 0.93`
      },
      {
        id: "bm-8",
        word: "Managed Currency Gap",
        centrality: Centrality.EDGE_CASE,
        explanation: "The decoupling of a currency's market value from its purchasing power due to central bank pegs or intervention.",
        dataInsight: "Evidence: Permanent undervaluation in nations with managed floating regimes (e.g., SE Asia) that never mean-reverts.",
        source: "Currency Risk",
        category: "Monetary Policy",
        isAIConfirmed: true,
        relevanceScore: 88,
        specificityScore: 92,
        logic: `concept "Managed Currency Gap"
  is a: block
  context: "Central bank intervention and capital controls"
  mechanism: "deliberate policy prevents currency appreciation to protect exports, creating a sustained 'burger' discount"
  evidence: "FX reserve accumulation vs PPP gap in emerging markets"
  replaces: "Policy Gap"
  relation:
    direction: downstream
    of: "The Emerging Discount"
    via: administrative_peg
  contrasts_with: "Monetary Inertia"
  scope: dataset-specific
  fidelity: 0.95`
      }
    ],
    cachedExpansion: [
      {
        id: "bm-exp-1",
        word: "Development-Adjusted PPP",
        centrality: Centrality.DOMINANT,
        explanation: "The sophisticated metric that isolates 'true' overvaluation by regressing prices against a country's development level.",
        dataInsight: "Evidence: Explains why some 'cheap' currencies are actually fairly valued once local wage levels are accounted for.",
        source: "The Economist Adjusted Index",
        category: "Sophisticated Metrics",
        specificityScore: 98,
        logic: `concept "Development-Adjusted PPP"
  is a: refinement
  context: "Truth-seeking in price data"
  mechanism: "statistically stripping the expected Balassa-Samuelson effect to find the underlying currency anomaly"
  evidence: "Residual analysis of Price-on-GDP regressions"
  replaces: "GDP-Adjusted PPP"
  fidelity: 0.99`
      },
      {
        id: "bm-exp-2",
        word: "The Commodity Floor",
        centrality: Centrality.PRESENT,
        explanation: "The globalized cost of physical inputs (beef, wheat) that should theoretically level prices across borders.",
        dataInsight: "Evidence: The baseline price for the physical components remains consistent, highlighting that 60% of price variance comes from local labor and rent.",
        source: "Global Commodity Audit",
        category: "Input Costs",
        specificityScore: 92,
        logic: `concept "The Commodity Floor"
  is a: baseline
  context: "Tradable vs Non-tradable inputs"
  mechanism: "globalized supply chains for food staples create a theoretical price floor that is violated by local productivity gaps"
  evidence: "Input cost parity vs local retail price variance"
  replaces: "The Google Index"
  contrasts_with: "Local Labor Anchor"
  fidelity: 0.94`
      },
      {
        id: "bm-3-exp",
        word: "Capital Flow Friction",
        centrality: Centrality.EDGE_CASE,
        explanation: "The noise in the signal: how sudden hot-money flows can temporarily crash or spike a currency's burger-value.",
        dataInsight: "Evidence: Massive 24-hour shifts in 'burger valuation' during local central bank interest rate announcements.",
        source: "Capital Flow Audit",
        category: "Market",
        specificityScore: 95,
        logic: `concept "Capital Flow Friction"
  is a: noise_driver
  context: "Volatility-driven decoupling"
  mechanism: "speculative capital moves faster than price indices, creating short-term statistical artifacts"
  evidence: "Intraday FX volatility vs quarterly CPI"
  replaces: "Currency Pegs"
  fidelity: 0.93`
      }
    ],
    metrics: {
      cohesion: 98,
      coverage: 92,
      entropy: 25,
      sharpness: 99,
      explanation: "The board provides a high-fidelity mapping of how national wealth and localized labor costs anchor the global economy's price signal.",
      synthesis: "Global price variance is not an error, but a structural tension between The Wealthy Surcharge and The Emerging Discount.",
      emergentPatterns: ["The Labor Anchor Cycle", "Policy-Driven Asymmetry"],
      links: [
        { source: "The Wealthy Surcharge", target: "The Emerging Discount", label: "Contrasts" },
        { source: "Local Labor Anchor", target: "The Wealthy Surcharge", label: "Anchors" },
        { source: "The Emerging Discount", target: "Managed Currency Gap", label: "Drives" }
      ],
      synthesisSuggestions: []
    }
  }
};
