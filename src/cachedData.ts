import { Tile, Centrality, BoardMetrics, NarrativeThread } from "./types";

// Bump this whenever CACHED_BOARDS content changes meaningfully. The app
// clears any locally-saved board that predates this version, so returning
// visitors see fresh cached data instead of a permanently stale local copy.
export const CACHED_DATA_VERSION = "6";

export const CACHED_BOARDS: Record<string, { tiles: Tile[], metrics: BoardMetrics, cachedExpansion?: Tile[], threads?: NarrativeThread[] }> = {
  "world-happiness-2025": {
    tiles: [
      {
        id: "h-1",
        word: "Resource Elasticity",
        centrality: Centrality.DOMINANT,
        explanation: "The capacity for wealth to buy individual agency and choice, rather than just survival.",
        dataInsight: "Verified against the real 2025 WHR panel (147 countries, Gallup World Poll): GDP-contribution correlates with the happiness score at r=0.745 — strong, but not the single strongest factor (Social Support edges it out at r=0.805). Costa Rica is the clearest decoupling case: GDP ranks only 58th of 147, yet it lands at #4 overall, driven by social support (1.483) rather than wealth. GDP and Social Support are themselves correlated (r=0.683) — the two channels overlap, but Costa Rica shows they aren't the same thing.",
        evidenceGrounded: true,
        source: "World Happiness Report 2025 panel data (2011-2025), Gallup World Poll",
        category: "Economics",
        specificityScore: 94,
        fidelity: 0.96,
        logic: `concept "Resource Elasticity"
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
  scope: global
  fidelity: 0.96`
      },
      {
        id: "h-2",
        word: "Communal Insulation",
        centrality: Centrality.DOMINANT,
        explanation: "The structural safety net provided by a reliable hierarchy of social connections.",
        dataInsight: "Verified: social-support contribution correlates with happiness at r=0.805 — the single strongest of the six explanatory factors in the 2025 panel, ahead of GDP (r=0.745). Iceland leads at 1.720, Finland at 1.638; Israel sits at 1.606 (happiness rank #8). Corrects the previously cited 1.84/1.74 figures, which don't match the real 2025 data.",
        evidenceGrounded: true,
        source: "World Happiness Report 2025 panel data (2011-2025), Gallup World Poll",
        category: "Social",
        specificityScore: 88,
        fidelity: 0.93,
        logic: `concept "Communal Insulation"
  is a: buffer
  context: "Communal safety nets"
  mechanism: "Trusted social networks reduce the psychological burden of crisis and improve recovery speed."
  evidence: "Support scores in high-trust nations (Iceland, Israel, Finland)"
  covers:
    explains: [national_resilience]
    aggregates: [social_support_score]
    replaces: "Social Cohesion"
  relation:
    direction: upstream
    of: "Emotional Security"
    via: relational_density
  scope: global
  fidelity: 0.93`
      },
      {
        id: "h-3",
        word: "Institutional Predictability",
        centrality: Centrality.PRESENT,
        explanation: "The level of confidence in public entities to act with transparency and fairness.",
        dataInsight: "Corrected: corruption-free contribution correlates with happiness at only r=0.392 — the weakest of the five major factors (only Generosity, r=0.042, is weaker), which is why this stays PRESENT rather than DOMINANT. Singapore actually leads this metric (0.512), not Finland/Denmark as previously claimed — Finland is second (0.491), Denmark third (0.474, below the originally claimed >0.48 threshold).",
        evidenceGrounded: true,
        source: "World Happiness Report 2025 panel data (2011-2025), Gallup World Poll",
        category: "Governance",
        specificityScore: 90,
        fidelity: 0.91,
        logic: `concept "Institutional Predictability"
  is a: foundation
  context: "Predictability of social contract"
  mechanism: "Transparent institutions reduce systemic anxiety and improve collective cooperation."
  evidence: "Corruption perception scores (Finland/Denmark leading clusters)"
  covers:
    explains: [institutional_trust]
    aggregates: [corruption_score]
    replaces: "Institutional Trust"
  relation:
    direction: upstream
    of: "Systemic Agency"
    via: rule_of_law
  scope: global
  fidelity: 0.91`
      },
      {
        id: "h-4",
        word: "Biological Vitality",
        centrality: Centrality.PRESENT,
        explanation: "The years of life spent in functional health, enabling participation in the social contract.",
        dataInsight: "Verified: health contribution correlates with happiness at r=0.678. Iceland (0.996), Finland (0.939) and Denmark (0.930) — the top-3 happiness-ranked countries — all score well above the panel average; Lesotho (0.000) and Botswana (0.017) anchor the bottom. But health alone doesn't guarantee overall rank: Hong Kong SAR has the single highest health score in the whole 147-country panel (1.238) yet ranks only 90th overall.",
        evidenceGrounded: true,
        source: "World Happiness Report 2025 panel data (2011-2025), Gallup World Poll",
        category: "Health",
        specificityScore: 85,
        fidelity: 0.94,
        logic: `concept "Biological Vitality"
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
  scope: global
  fidelity: 0.94`
      },
      {
        id: "h-5",
        word: "Agency Capacity",
        centrality: Centrality.EDGE_CASE,
        explanation: "The perceived freedom to self-determine life path without permission or fear.",
        dataInsight: "Corrected: the original 'similar GDP' framing was wrong — Viet Nam (GDP rank 84/147) and Singapore (GDP rank 1/147) aren't close in wealth. The real, sharper finding: Viet Nam holds the single highest freedom-to-choose score in the entire panel (1.147) despite middling GDP, while Singapore — despite topping the GDP ranking outright — sits only 50th of 146 in freedom (0.980). Finland and Iceland score 1.105, just below Viet Nam's global lead.",
        evidenceGrounded: true,
        source: "World Happiness Report 2025 panel data (2011-2025), Gallup World Poll",
        category: "Rights",
        specificityScore: 92,
        fidelity: 0.89,
        logic: `concept "Agency Capacity"
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
    of: "Resource Elasticity"
    via: choice_capability
  scope: global
  fidelity: 0.89`
      },
      {
        id: "h-6",
        word: "Agency-Resource Gap",
        centrality: Centrality.PRESENT,
        explanation: "The disconnect where rising income fails to translate into perceived freedom of life choice.",
        dataInsight: "Verified: Singapore tops the GDP ranking (1st of 147) but ranks only 36th in overall happiness and 50th of 146 in freedom (0.980). Republic of Korea shows the same pattern more sharply: GDP rank 24/147 but happiness rank 67 and freedom rank 102/146 (0.825). The United States fits too: GDP rank 6/147, happiness rank 23, freedom only 0.776. The gap itself is real and data-grounded; 'restrictive social norms' as the cause is our inference, not something this dataset can verify.",
        evidenceGrounded: true,
        source: "World Happiness Report 2025 panel data (2011-2025), Gallup World Poll",
        category: "Tension",
        specificityScore: 95,
        fidelity: 0.94,
        logic: `concept "Agency-Resource Gap"
  is a: tension
  context: "Hollow vs functional freedom"
  mechanism: "formal rights are psychologically hollow without the economic agency or social permissions to exercise them"
  evidence: "Freedom score vs income deciles in high-wealth, high-pressure societies"
  covers:
    explains: [hollow_autonomy]
    aggregates: [freedom_score, gdp_per_capita]
    replaces: "Civil liberties"
  relation:
    direction: downstream
    of: "Resource Elasticity"
    via: structural_friction
  scope: global
  fidelity: 0.94`
      },
      {
        id: "h-7",
        word: "Digital Fragmentation",
        centrality: Centrality.EDGE_CASE,
        explanation: "The erosion of physical social cohesion through hyper-individualized digital consumption.",
        dataInsight: "General domain knowledge (not data-verified): the real 2025 WHR panel used for this board has no internet-usage or screen-time columns, so this claim can't be checked against the data on this board — kept as a plausible, previously-cited claim pending a dataset that actually measures it.",
        evidenceGrounded: false,
        source: "General domain knowledge — not verified against the WHR 2025 panel used for this board",
        category: "Technology",
        specificityScore: 92,
        fidelity: 0.94,
        logic: `concept "Digital Fragmentation"
  is a: risk
  context: "Social side-effects of digital immersion"
  mechanism: "algorithmic sorting reduces shared physical experiences and erodes local social trust"
  evidence: "Inverse correlation between internet usage density and social trust (OECD 2025 data)"
  covers:
    explains: [social_atomization, youth_happiness_drop]
    aggregates: [screen_time_averages]
  relation:
    direction: downstream
    of: "Communal Insulation"
    via: community_erosion
  contrasts_with: "Cultural Anchoring"
  scope: global
  fidelity: 0.94`
      },
      {
        id: "h-8",
        word: "Cultural Anchoring",
        centrality: Centrality.PRESENT,
        explanation: "The role of shared traditional values in providing existential meaning and community resilience.",
        dataInsight: "Corrected: Israel is #8 (verified), but Mexico is #12, not #10 as previously claimed. Both outperform their GDP tier — Mexico's GDP contribution (1.636) sits well outside the top 20, yet it lands at #12 overall.",
        evidenceGrounded: true,
        source: "World Happiness Report 2025 panel data (2011-2025), Gallup World Poll",
        category: "Culture",
        specificityScore: 94,
        fidelity: 0.91,
        logic: `concept "Cultural Anchoring"
  is a: stabilizer
  context: "Existential meaning structures"
  mechanism: "shared narratives and rituals provide a psychological buffer against societal change"
  evidence: "High 'Community Support' scores in traditional or religious clusters (Israel, Mexico)"
  covers:
    explains: [existential_stability]
    aggregates: [cultural_values]
  relation:
    direction: upstream
    of: "Social Cohesion"
    via: shared_meaning
  contrasts_with: "Digital Fragmentation"
  scope: global
  fidelity: 0.91`
      }
    ],
    cachedExpansion: [],
    threads: [
      {
        id: "wh-thread-1",
        title: "The Security Foundation",
        conceptWords: ["Resource Elasticity", "Institutional Predictability", "Biological Vitality"],
        synthesis: "Economic resources, predictable institutions, and physical health together set the floor beneath national well-being — the baseline conditions that make everything else possible.",
        coheres: "yes",
      },
      {
        id: "wh-thread-2",
        title: "The Freedom Paradox",
        conceptWords: ["Agency Capacity", "Agency-Resource Gap"],
        synthesis: "Freedom to choose only becomes real happiness when economic resources back it up — without them, formal freedom is just a gap between what's legal and what's livable.",
        coheres: "yes",
      },
      {
        id: "wh-thread-3",
        title: "The Connection Collapse",
        conceptWords: ["Communal Insulation", "Digital Fragmentation", "Cultural Anchoring"],
        synthesis: "Traditional social bonds buffer people against hardship, but digital fragmentation is eroding those bonds — cultural anchoring is what still holds some societies together against that drift.",
        coheres: "yes",
      },
      {
        id: "wh-thread-unaddressed",
        title: "Unaddressed",
        conceptWords: [],
        synthesis: "This board explains structural correlates of the happiness score, not why otherwise-similar-wealth countries diverge sharply: Costa Rica (GDP rank 58 of 147) outranks the United States (GDP rank 6) in overall happiness, and Communal Insulation is only a partial answer. Generosity, the sixth WHR factor, barely correlates with happiness at all (r=0.042) and has no concept representing it here.",
        coheres: "no",
        isResidual: true,
      },
    ],
    metrics: {
      cohesion: 96,
      coverage: 95,
      entropy: 32,
      sharpness: 98,
      explanation: "The board maps a high-fidelity causal narrative from baseline resources to the modern collision between digital fragmentation and cultural anchoring.",
      synthesis: "Global well-being is a structural outcome of Resource Elasticity and Communal Insulation — with Communal Insulation the stronger of the two (r=0.805 vs. 0.745 in the real 2025 panel) — threatened by an unverified Digital Fragmentation claim but stabilized by Cultural Anchoring.",
      emergentPatterns: ["The Nordic Stability Cycle", "Security-Choice Tension", "The Meaning Buffer"],
      links: [
        { source: "Resource Elasticity", target: "Communal Insulation", label: "Pairs with" },
        { source: "Institutional Predictability", target: "Resource Elasticity", label: "Foundations" },
        { source: "Biological Vitality", target: "Resource Elasticity", label: "Prerequisite" },
        { source: "Agency-Resource Gap", target: "Resource Elasticity", label: "Tensions" },
        { source: "Digital Fragmentation", target: "Communal Insulation", label: "Erodes" },
        { source: "Cultural Anchoring", target: "Digital Fragmentation", label: "Contrasts" },
        { source: "Agency Capacity", target: "Resource Elasticity", label: "Outcome" }
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
  scope: regional
  fidelity: 0.91`
      }
    ],
    threads: [
      {
        id: "gss-thread-1",
        title: "The Committed Life",
        conceptWords: ["Marital Stability", "Personal Health", "Job Satisfaction"],
        synthesis: "Stable marriage, good health, and meaningful work reinforce each other — three anchors of the traditional American path to life satisfaction.",
        coheres: "yes",
      },
      {
        id: "gss-thread-2",
        title: "The Relative Standing Problem",
        conceptWords: ["Financial Satisfaction", "Social Isolation"],
        synthesis: "How satisfied people feel with their finances depends on comparison to peers, not absolute income — and as social networks shrink, that comparison itself gets harder to make.",
        coheres: "partial",
        missingLink: "The causal link between financial comparison and social isolation is plausible but not directly evidenced in this dataset — worth testing before treating as settled.",
      },
      {
        id: "gss-thread-unaddressed",
        title: "Unaddressed",
        conceptWords: [],
        synthesis: "This board hasn't been checked against a real GSS extract yet, unlike the Big Mac, World Happiness, and GPTs-are-GPTs boards — so the most honest unaddressed item is that every claim here is illustrative of the methodology, not independently verified evidence.",
        coheres: "no",
        isResidual: true,
      },
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
        centrality: Centrality.PRESENT,
        explanation: "A systematic price premium concentrated in a small number of extreme-GDP economies, not a broad high-income pattern — corrected from an earlier overclaim.",
        dataInsight: "Corrected against the real July 2026 snapshot: Switzerland ($9.04, +45.4% vs. the $6.22 US baseline) and Norway ($8.05, +29.5%) still carry a real premium. But the original claim of a broad 'high-GDP nations' pattern doesn't hold — the 10 highest-GDP countries in the panel average $5.58, actually 10.3% *below* the US price. The premium is real but concentrated in 2-3 extreme cases, not the top of the GDP range generally. Downgraded from DOMINANT to PRESENT to match.",
        evidenceGrounded: true,
        source: "The Economist Big Mac Index (github.com/TheEconomist/big-mac-data), Jul 2026",
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
        dataInsight: "Verified against The Economist's own Big Mac Index data (Jan 2026 snapshot): Taiwan $2.47, India $2.51, Indonesia $2.52, Egypt $2.65, and Vietnam $2.89 all sit 53-60% below the $6.12 US baseline.",
        evidenceGrounded: true,
        source: "The Economist Big Mac Index (github.com/TheEconomist/big-mac-data), Jan 2026",
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
        dataInsight: "Checked against the full 52-country Jan 2026 dataset: GDP per capita correlates only moderately with Big Mac price (r ≈ 0.29) — directionally consistent with wage-anchoring, but far from a clean linear relationship. Other forces clearly move prices independent of GDP alone.",
        evidenceGrounded: true,
        source: "The Economist Big Mac Index (github.com/TheEconomist/big-mac-data), Jan 2026",
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
        dataInsight: "Verified across the time series: Argentina's Big Mac valuation swung from 32.6% undervalued (Jan 2024) to 20.1% overvalued (Jan 2025) to 9.6% undervalued (Jan 2026) — a 50+ point swing in two years, real short-term volatility disconnected from a stable PPP trend.",
        evidenceGrounded: true,
        source: "The Economist Big Mac Index (github.com/TheEconomist/big-mac-data), 2024-2026 time series",
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
  scope: global
  fidelity: 0.91`
      },
      {
        id: "bm-6",
        word: "Integrated Parity",
        centrality: Centrality.PRESENT,
        explanation: "The tendency for nations within shared trade blocs (like the Eurozone) to maintain near-zero variance in standardized good prices.",
        dataInsight: "Not directly checkable against this dataset: The Economist reports the Eurozone as a single aggregated 'Euro area' row rather than disaggregating member countries, so internal Eurozone price variance can't be verified from this sample — kept on the board as a plausible, previously-cited claim, not a re-verified one.",
        evidenceGrounded: false,
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
  scope: regional
  fidelity: 0.94`
      },
      {
        id: "bm-7",
        word: "Logistical Premia",
        centrality: Centrality.EDGE_CASE,
        explanation: "Non-economic price spikes caused by local import tariffs (beef/wheat) or severe logistical bottlenecks — this replaced an earlier, unverified claim about Israel and Brazil once checked against real data: Israel is actually priced almost exactly where its GDP predicts (a negligible +$0.04 residual) in the current data, not an outlier at all.",
        dataInsight: "Verified: Uruguay is the single largest positive outlier in the entire 52-country Jan 2026 dataset, priced $0.84 above what GDP alone predicts — well beyond Switzerland's $0.53 premium. Colombia (+$0.35) and Mexico (+$0.31) show smaller but real versions of the same pattern.",
        evidenceGrounded: true,
        source: "The Economist Big Mac Index (github.com/TheEconomist/big-mac-data), Jan 2026",
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
        dataInsight: "Re-checked against the real July 2026 snapshot: Vietnam (-53.5%), Indonesia (-61.7%), and the Philippines (-56.0%) are all still deeply undervalued — the mechanism holds. But they're no longer the most extreme cases on the board: Taiwan (-61.0%) and India (-60.5%) now exceed Vietnam and the Philippines, which the January-only framing didn't capture. The named examples were accurate then and are stale now — a live instance of why a concept needs periodic re-grounding, not just an initial check.",
        evidenceGrounded: true,
        source: "The Economist Big Mac Index (github.com/TheEconomist/big-mac-data), Jul 2026",
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
      },
      {
        id: "bm-9",
        word: "Contractionary Strength",
        centrality: Centrality.PRESENT,
        explanation: "A country's currency and local price both rising together while its economy contracts — the opposite of the usual pattern where a strengthening currency tracks growth.",
        dataInsight: "Grounded, narrowly: comparing the Jan-to-Jul 2026 change, only 3 of 53 countries show both local price and currency rising by more than 3% each — Colombia, Costa Rica, and Israel. All three also show negative GDP growth over the same period (-3.4%, -0.5%, -8.4%). Confound-checked against the outlier-status finding on this board: all three were already positive price-outliers in January, so this describes an *intensifying* existing outlier, not a separate mechanism. The likely driver — defensive interest-rate hikes attracting capital despite a weak economy — could not be independently verified: real central bank rate data was not reachable to check. n=3 is thin; treat this as a real but narrow pattern, not a settled finding.",
        evidenceGrounded: true,
        source: "The Economist Big Mac Index (github.com/TheEconomist/big-mac-data), Jan-Jul 2026 comparison",
        category: "Currency Dynamics",
        isAIConfirmed: true,
        relevanceScore: 78,
        specificityScore: 90,
        logic: `concept "Contractionary Strength"
  is a: tension
  context: "Currency appreciation decoupled from economic growth"
  mechanism: "unconfirmed — plausibly defensive monetary policy (rate hikes to fight inflation despite contraction), not independently verified against real rate data"
  evidence: "Colombia, Costa Rica, Israel: price +5% to +15%, currency +4.6% to +12.2%, GDP -0.5% to -8.4%, all in the same 6-month window"
  covers:
    explains: [outlier_intensification]
  relation:
    direction: downstream
    of: "The Wealthy Surcharge"
    via: outlier_persistence
  scope: dataset-specific
  fidelity: 0.62`
      },
      {
        id: "bm-10",
        word: "Parity Reversion",
        centrality: Centrality.DOMINANT,
        explanation: "The dominant background pattern the board's other findings sit on top of: most countries' currencies move to offset domestic price changes, not reinforce them.",
        dataInsight: "Verified across the full Jan-to-Jul 2026 panel: local price change and currency change correlate at r=-0.944 across 53 countries — a strong, real, offsetting relationship (when local prices rise, the currency tends to weaken to compensate, and vice versa). 43 of 53 countries follow this pattern; only 3 (Contractionary Strength) clearly break it. This wasn't previously named on the board — every other tile describes a deviation from parity; this names the norm the deviations are exceptions to.",
        evidenceGrounded: true,
        source: "The Economist Big Mac Index (github.com/TheEconomist/big-mac-data), Jan-Jul 2026 comparison",
        category: "Currency Dynamics",
        isAIConfirmed: true,
        relevanceScore: 90,
        specificityScore: 88,
        logic: `concept "Parity Reversion"
  is a: norm
  context: "Baseline currency-price relationship across the panel"
  mechanism: "currencies adjust to offset domestic price changes, consistent with short-run purchasing power parity holding at the panel level"
  evidence: "r=-0.944 correlation between local price change and currency change, Jan-Jul 2026, n=53"
  covers:
    explains: [background_self_correction]
  relation:
    direction: upstream
    of: "Contractionary Strength"
    via: baseline_against_which_exceptions_are_visible
  scope: global
  fidelity: 0.96`
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
    threads: [
      {
        id: "bm-thread-1",
        title: "The Two-Sided Price Gap",
        conceptWords: ["The Wealthy Surcharge", "The Emerging Discount"],
        synthesis: "Global burger price variance isn't noise — it's the structural outcome of the same mechanism pulling in opposite directions: rich-country labor costs push prices up, emerging-market labor costs pull them down.",
        coheres: "yes",
      },
      {
        id: "bm-thread-2",
        title: "The Labor Cost Mechanism",
        conceptWords: ["Local Labor Anchor", "The Wealthy Surcharge"],
        synthesis: "The wealthy surcharge isn't abstract — it's mechanically produced by local labor costs anchoring service-sector prices to domestic productivity.",
        coheres: "yes",
      },
      {
        id: "bm-thread-3",
        title: "The Friction Layer",
        conceptWords: ["Monetary Inertia", "Logistical Premia", "Managed Currency Gap"],
        synthesis: "Beyond the core wealth/labor mechanism, three separate frictions distort prices further — exchange-rate lag, tariffs, and deliberate currency management each break the clean PPP prediction in their own way.",
        coheres: "yes",
      },
      {
        id: "bm-thread-unaddressed",
        title: "Unaddressed",
        conceptWords: [],
        synthesis: "Local Labor Anchor's own dataInsight admits GDP per capita correlates only moderately with Big Mac price (r≈0.23-0.29 depending on snapshot) — meaning most of the country-to-country price variance isn't attributable to any single concept on this board. And Contractionary Strength's own mechanism is still open: real interest-rate data to confirm whether defensive rate hikes actually explain Colombia, Costa Rica, and Israel's pattern was not reachable to check — the pattern is grounded, the explanation for it isn't.",
        coheres: "no",
        isResidual: true,
      },
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
  },
  "gpts-are-gpts": {
    tiles: [
      {
        id: "gg-1",
        word: "Syntactic Sandbox",
        centrality: Centrality.DOMINANT,
        explanation: "High AI exposure within purely symbolic, alphanumeric routines that lack physical/motor constraints.",
        dataInsight: "Verified against the real Eloundou et al. (2023) occupation-level dataset (923 occupations): the model rates Correspondence Clerks and Proofreaders near-total exposure across all tiers (0.95-1.00). Human raters agree only at the broadest 'full exposure incl. complementary technology' tier (gamma: 0.89-1.00) — at the direct/no-tools tier (alpha), human ratings are far more conservative (Correspondence Clerks 0.57, Proofreaders 0.20). 'Nearly 100% on both scales' only holds at the broadest tier, not the direct one.",
        evidenceGrounded: true,
        source: "Eloundou et al. (2023), github.com/openai/GPTs-are-GPTs, occ_level.csv",
        category: "Cognitive",
        specificityScore: 98,
        fidelity: 0.98,
        logic: `concept "Syntactic Sandbox"
  is a: driver
  context: "Alphanumeric cognitive workflows"
  mechanism: "purely symbolic data processing has zero mechanical inertia and can be fully ingested by LLMs"
  evidence: "100% mid/high exposure ratings for Correspondence Clerks and Proofreaders in both human and model metrics"
  covers:
    explains: [automation_vulnerability]
    aggregates: [AI_Exposure_Human_High, AI_Exposure_Model_High]
    replaces: "Administrative tasks"
  relation:
    direction: upstream
    of: "Semantic Automation"
    via: syntactic_transference
  contrasts_with: "Physical Anchor"
  scope: global
  fidelity: 0.98`
      },
      {
        id: "gg-2",
        word: "Physical Anchor",
        centrality: Centrality.DOMINANT,
        explanation: "The structural safety of jobs bound to the physical configuration of spatial reality or biological objects.",
        dataInsight: "Corrected: the original examples don't hold up — human raters actually rate Concierges at 0.67 and Animal Scientists at 0.75 direct exposure, not low at all. The real pattern: 160 of 923 occupations (17%) are rated below 0.05 direct exposure by BOTH model and human raters — genuine cross-rater agreement concentrated in manual trades: Carpenters, Automotive Service Technicians and Mechanics, Construction Laborers, Brickmasons, and Cooks (Fast Food/Short Order) among them.",
        evidenceGrounded: true,
        source: "Eloundou et al. (2023), github.com/openai/GPTs-are-GPTs, occ_level.csv",
        category: "Physical",
        specificityScore: 95,
        fidelity: 0.96,
        logic: `concept "Physical Anchor"
  is a: barrier
  context: "Manual and physical labor routines"
  mechanism: "embodied actions require expensive mechanical robotics and spatial navigation that cannot be simulated purely by text models"
  evidence: "Low AI exposure ratings for Concierges, Animal/Soil/Plant Scientists, and hands-on maintenance workers"
  covers:
    explains: [employment_resilience]
    aggregates: [AI_Exposure_Human_Low, AI_Exposure_Model_Low]
    replaces: "Manual labor"
  relation:
    direction: downstream
    of: "Syntactic Sandbox"
    via: spatial_shielding
  contrasts_with: "Syntactic Sandbox"
  scope: global
  fidelity: 0.96`
      },
      {
        id: "gg-3",
        word: "Projection Gap",
        centrality: Centrality.PRESENT,
        explanation: "The systemic discrepancy between human self-assessments of work complexity and AI models' projection of their own capabilities.",
        dataInsight: "Corrected: across all 923 occupations, model and human ratings are essentially tied on average at the direct-exposure tier (0.142 vs 0.144) with only moderate correlation (r=0.435) — not a simple one-directional bias. When they diverge sharply, it splits two ways: the model rates itself far HIGHER than humans for occupations needing certified/tested output (Court Reporters: 0.92 vs 0.12; Software Developers: 0.79 vs 0.05); humans rate exposure far HIGHER than the model for occupations involving field or regulatory judgment (Animal Scientists: human 0.75 vs model 0.12; Survey Researchers: human 0.75 vs model 0.25 — the original 0.50 gap figure is right, but the direction was backwards: humans rated it MORE exposed, not less).",
        evidenceGrounded: true,
        source: "Eloundou et al. (2023), github.com/openai/GPTs-are-GPTs, occ_level.csv",
        category: "Cognitive",
        specificityScore: 92,
        fidelity: 0.92,
        logic: `concept "Projection Gap"
  is a: tension
  context: "Human self-rating vs model capability-rating"
  mechanism: "the gap runs in both directions depending on the occupation: models overrate their own exposure where verified/certified accuracy is the real bottleneck, and underrate it where field presence or regulatory judgment matters"
  evidence: "Survey Researchers (human 0.75 vs model 0.25) and Court Reporters (model 0.92 vs human 0.12) show the gap running in opposite directions"
  covers:
    explains: [automation_surprise]
    aggregates: [AI_Exposure_Human_Low, AI_Exposure_Model_Low]
    replaces: "Confidence variance"
  relation:
    direction: upstream
    of: "Transition Friction"
    via: cognitive_dissonance
  scope: global
  fidelity: 0.92`
      },
      {
        id: "gg-4",
        word: "Relational Shield",
        centrality: Centrality.PRESENT,
        explanation: "The retention of human authority in workflows where trust, legal responsibility, or social empathy can never be delegated.",
        dataInsight: "Corrected: Interpreters don't actually support this concept — both model (0.88) and human (0.80) rate them highly exposed, the opposite of 'shielded.' The real supporting evidence: Judges & Magistrates (model 0.00, human 0.06), Physician Assistants (0.00/0.00), and Nurse Anesthetists (0.00/0.00) show genuine cross-rater agreement on near-zero direct exposure — roles bound by legal responsibility or hands-on clinical judgment that neither rater treats as automatable, despite being cognitively demanding rather than manual.",
        evidenceGrounded: true,
        source: "Eloundou et al. (2023), github.com/openai/GPTs-are-GPTs, occ_level.csv",
        category: "Trust",
        specificityScore: 90,
        fidelity: 0.91,
        logic: `concept "Relational Shield"
  is a: constraint
  context: "Legal and clinical judgment roles"
  mechanism: "legal liability and hands-on clinical judgment mean neither model nor human raters treat these roles as automatable, regardless of cognitive complexity"
  evidence: "Judges & Magistrates, Physician Assistants, and Nurse Anesthetists all show near-zero direct exposure on both model and human scales"
  covers:
    explains: [retention_index]
    aggregates: [AI_Exposure_Human_Mid]
    replaces: "Soft skills"
  relation:
    direction: upstream
    of: "Automation Ceiling"
    via: legal_responsibility
  scope: global
  fidelity: 0.91`
      },
      {
        id: "gg-5",
        word: "AI Overconfidence",
        centrality: Centrality.EDGE_CASE,
        explanation: "The model's tendency to rate creative or highly subjective semantic tasks as fully exposed, projecting complete capability.",
        dataInsight: "Verified: model self-rating for Poets, Lyricists and Creative Writers is flat 0.89 across all tiers; human raters are notably lower at the direct-exposure tier (0.67 vs the model's 0.89). This matches a real board-wide pattern at the broader tiers: averaged across all 923 occupations, the model rates itself higher than humans rate it at the mid/high tier (0.345 vs 0.303) and the full-exposure tier (0.548 vs 0.461) — a systematic scaling difference, not random noise (the two tiers correlate at r=0.88-0.91).",
        evidenceGrounded: true,
        source: "Eloundou et al. (2023), github.com/openai/GPTs-are-GPTs, occ_level.csv",
        category: "Creative",
        specificityScore: 94,
        fidelity: 0.89,
        logic: `concept "AI Overconfidence"
  is a: risk
  context: "Creative and artistic outputs"
  mechanism: "lossy statistical patterns are mistranslated by reinforcement loops as equivalent to original human cultural creation"
  evidence: "Poets, Lyricists and Creative Writers showing flat 0.889 exposure on all high-level model columns"
  covers:
    explains: [artistic_dilution]
    aggregates: [AI_Exposure_Model_High]
    replaces: "Creative automation"
  relation:
    direction: upstream
    of: "Cultural Commoditization"
    via: stylistic_imitation
  scope: global
  fidelity: 0.89`
      },
      {
        id: "gg-6",
        word: "Life Sciences Buffer",
        centrality: Centrality.EDGE_CASE,
        explanation: "The mechanical resilience of life science research that requires chemical testing, field sampling, and organic execution.",
        dataInsight: "Downgraded per confound check: this claim holds only under the model's own self-rating (Animal Scientists 0.12, Soil/Plant Scientists 0.00 — both low), but human raters see it oppositely — Animal Scientists 0.75 is one of the highest human-rated occupations in the entire panel, and Soil/Plant Scientists sits at a moderate 0.43. The 'buffer' framing isn't independently grounded once you check the human side; it's confounded by which rater you trust, so this drops from PRESENT to EDGE_CASE rather than being removed outright.",
        evidenceGrounded: true,
        source: "Eloundou et al. (2023), github.com/openai/GPTs-are-GPTs, occ_level.csv",
        category: "Physical",
        specificityScore: 88,
        fidelity: 0.90,
        logic: `concept "Life Sciences Buffer"
  is a: stabilizer
  context: "Life sciences and laboratory sciences"
  mechanism: "unresolved — the model rates fieldwork as low-exposure, but human raters disagree; no confirmed mechanism survives the confound check"
  evidence: "Model rates Animal/Soil/Plant Scientists as low exposure (0.00-0.12), but human raters rate the same occupations moderate-to-high (0.43-0.75) — a genuine rater disagreement, not a confirmed buffer"
  covers:
    explains: [field_resilience]
    aggregates: [AI_Exposure_Human_Low, AI_Exposure_Model_Low]
    replaces: "Scientific isolation"
  relation:
    direction: downstream
    of: "Physical Anchor"
    via: biological_friction
  scope: global
  fidelity: 0.90`
      },
      {
        id: "gg-7",
        word: "Programming Exposure",
        centrality: Centrality.PRESENT,
        explanation: "Computer programmers and designers are highly exposed because they operate in formal, mathematically consistent syntax.",
        dataInsight: "Corrected for tier precision: at the mid/high (beta) tier, Web Developers (model 0.93) and Computer Programmers (model 0.95) are well above 0.68, but human beta ratings are lower and more mixed — Web Developers 0.63 (below 0.68), Computer Programmers and Web/Digital Interface Designers both exactly at 0.68 rather than above it. 'Above 0.68 on both scales' only holds cleanly for the model side.",
        evidenceGrounded: true,
        source: "Eloundou et al. (2023), github.com/openai/GPTs-are-GPTs, occ_level.csv",
        category: "Cognitive",
        specificityScore: 95,
        fidelity: 0.94,
        logic: `concept "Programming Exposure"
  is a: driver
  context: "Formal logic and programming sandboxes"
  mechanism: "languages with rigid compilation rules offer infinite programmatic validation loops, speeding up AI auto-correction"
  evidence: "Web Designers and Computer Programmers showing high-frequency cognitive automation in both human and model columns"
  covers:
    explains: [developer_leverage]
    aggregates: [AI_Exposure_Model_High]
    replaces: "Software engineering baseline"
  relation:
    direction: upstream
    of: "Syntactic Sandbox"
    via: sandbox_loops
  scope: global
  fidelity: 0.94`
      },
      {
        id: "gg-8",
        word: "Semantic Transference",
        centrality: Centrality.EDGE_CASE,
        explanation: "The process where translation, pure editing, and technical text structures are fully absorbed into transformer neural pipelines.",
        dataInsight: "Corrected: Interpreters and Translators clear 0.80 on both scales (model 0.88, human 0.80), but Correspondence Clerks only clears 0.80 by the model's rating (0.96) — human raters put it at 0.57 direct exposure, well below 0.80. Holds fully only at the broadest 'full exposure with complementary tools' (gamma) tier, where Correspondence Clerks reaches 0.89 human / 0.96 model.",
        evidenceGrounded: true,
        source: "Eloundou et al. (2023), github.com/openai/GPTs-are-GPTs, occ_level.csv",
        category: "Translate",
        specificityScore: 91,
        fidelity: 0.91,
        logic: `concept "Semantic Transference"
  is a: risk
  context: "Information translation and structure"
  mechanism: "pure semantic conversion of pre-existing documents requires no real-world agency, matching LLM's core transformers"
  evidence: "Interpreters and Translators scoring above 0.80 exposure on both Human and Model scales"
  covers:
    explains: [translation_displacement]
    aggregates: [AI_Exposure_Human_High]
    replaces: "Bilingual translation"
  relation:
    direction: upstream
    of: "Syntactic Sandbox"
    via: direct_mapping
  scope: global
  fidelity: 0.91`
      }
    ],
    cachedExpansion: [],
    threads: [
      {
        id: "gg-thread-1",
        title: "The Syntax vs. Substance Divide",
        conceptWords: ["Syntactic Sandbox", "Physical Anchor"],
        synthesis: "AI exposure splits cleanly along one axis: work that's pure symbol manipulation is highly exposed, work bound to physical or biological reality is not.",
        coheres: "yes",
      },
      {
        id: "gg-thread-2",
        title: "The Overconfidence Risk",
        conceptWords: ["AI Overconfidence", "Semantic Transference"],
        synthesis: "Models rate their own creative and semantic capabilities as fully mastered — both in translation-style tasks and creative authorship — which is exactly the overconfidence pattern worth flagging before trusting model self-assessment.",
        coheres: "yes",
      },
      {
        id: "gg-thread-3",
        title: "Confidence vs. Confound",
        conceptWords: ["Relational Shield", "Life Sciences Buffer"],
        synthesis: "Both concepts claim a domain is protected from automation, but only one survives a confound check: Relational Shield holds because model and human raters independently agree (Judges, Physician Assistants both near-zero exposure); Life Sciences Buffer doesn't, because the model's low rating for Animal Scientists is directly contradicted by a high human rating for the same occupation — a real disagreement, not a resolved buffer.",
        coheres: "partial",
        missingLink: "One concept is confirmed by rater agreement, the other is an open disagreement between raters — they belong on the board for different reasons, not the same one.",
      },
      {
        id: "gg-thread-unaddressed",
        title: "Unaddressed",
        conceptWords: [],
        synthesis: "This board explains which occupations are rated as exposed to AI capability, based on task-level ratings from 2023 — it says nothing about actual employment or wage outcomes. The dataset measures perceived exposure, not real-world displacement, which hasn't played out at the scale the ratings alone would predict.",
        coheres: "no",
        isResidual: true,
      },
    ],
    metrics: {
      cohesion: 95,
      coverage: 94,
      entropy: 28,
      sharpness: 96,
      explanation: "The board successfully maps the collision between alphanumeric cognitive labor and the spatial / biological reality that anchors human work.",
      synthesis: "AI exposure is not a linear function of job complexity, but a structural split between the Syntactic Sandbox and the Physical Anchor.",
      emergentPatterns: ["The Embodied Retention Frontier", "The Syntactic Coding Ceiling", "Epistemic Bias in Creativity"],
      links: [
        { source: "Syntactic Sandbox", target: "Physical Anchor", label: "Contrasts" },
        { source: "Programming Exposure", target: "Syntactic Sandbox", label: "Accelerates" },
        { source: "Semantic Transference", target: "Syntactic Sandbox", label: "Aggregates" },
        { source: "Life Sciences Buffer", target: "Physical Anchor", label: "Anchors" },
        { source: "Projection Gap", target: "Syntactic Sandbox", label: "Tensions" }
      ],
      synthesisSuggestions: []
    }
  }
};
