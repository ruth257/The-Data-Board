import { Tile, Centrality, BoardMetrics, NarrativeThread } from "./types";

// Bump this whenever CACHED_BOARDS content changes meaningfully. The app
// clears any locally-saved board that predates this version, so returning
// visitors see fresh cached data instead of a permanently stale local copy.
export const CACHED_DATA_VERSION = "8";

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
  scope: global`
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
  scope: global`
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
  scope: global`
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
  scope: global`
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
  scope: global`
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
  scope: global`
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
  scope: global`
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
  scope: global`
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
  "big-mac-index": {
    tiles: [
      {
        id: "bm-10",
        word: "Parity Reversion",
        centrality: Centrality.DOMINANT,
        explanation: "The board's core category: the baseline pattern every other concept here is a deviation from. Most countries' currencies move to offset domestic price changes, not reinforce them.",
        dataInsight: "Verified across the full Jan-to-Jul 2026 panel: local price change and currency change correlate at r=-0.944 across 53 countries. 43 of 53 countries follow this pattern. Saturated: as more countries were checked, the relationship held rather than reshaping — new indicators extended its range without changing what it means.",
        evidenceGrounded: true,
        source: "The Economist Big Mac Index (github.com/TheEconomist/big-mac-data), Jan-Jul 2026 comparison",
        category: "Currency Dynamics",
        isAIConfirmed: true,
        logic: `concept "Parity Reversion"
  is a: core_category
  context: "Baseline currency-price relationship across the panel"
  mechanism: "currencies adjust to offset domestic price changes, consistent with short-run purchasing power parity holding at the panel level"
  evidence: "r=-0.944 correlation between local price change and currency change, Jan-Jul 2026, n=53"
  covers:
    explains: [background_self_correction]
  relation:
    direction: upstream
    of: "Northern European Premium, Asian Currency Suppression, Defensive Currency Premium"
    via: baseline_against_which_deviations_are_visible
  scope: global`
      },
      {
        id: "bm-8",
        word: "Asian Currency Suppression",
        centrality: Centrality.DOMINANT,
        explanation: "A regional currency-undervaluation pattern that holds regardless of income level — the region's richest and poorest economies are undervalued by nearly the same logic, which rules out labor cost as the driver.",
        dataInsight: "Open-coded from the full July 2026 panel, not preselected: all 13 Asian economies present show negative GDP-adjusted valuation (The Economist's own productivity-adjusted index), from Singapore (-11.4%, GDP $108k) to Taiwan (-61.9%, GDP $98k) down to India (-49.5%, GDP $6k) and Pakistan (-19.0%, GDP $2.7k). Mean -37.1% vs. +6.1% for the rest of the 52-country panel. Income-independent — Taiwan and Hong Kong are richer than the US yet more undervalued than Vietnam, which directly rules out a labor-cost explanation. This concept absorbs and replaces two earlier, weaker attempts to name this territory ('The Emerging Discount' and 'Managed Currency Gap'), both retired: they preselected a handful of poor countries and missed that the pattern is regional and income-independent, not a poverty story. Mechanism (deliberate policy vs. structural export orientation) is not independently verified — real central bank policy data was not reachable to check.",
        evidenceGrounded: true,
        source: "The Economist Big Mac Index (github.com/TheEconomist/big-mac-data), Jul 2026, full 52-country panel",
        category: "Monetary Policy",
        isAIConfirmed: true,
        logic: `concept "Asian Currency Suppression"
  is a: regional_pattern
  context: "Currency valuation independent of productivity, concentrated in one region"
  mechanism: "unconfirmed — plausibly deliberate export-currency policy or structural export orientation; not independently verified against real policy data"
  evidence: "13/13 Asian economies in the panel show negative GDP-adjusted valuation, spanning a 40x GDP range ($2.7k-$108k); mean -37.1% vs +6.1% elsewhere"
  covers:
    explains: [regional_undervaluation]
    replaces: "The Emerging Discount, Managed Currency Gap"
  relation:
    direction: downstream
    of: "Parity Reversion"
    via: sustained_deviation
  scope: regional`
      },
      {
        id: "bm-2",
        word: "Northern European Premium",
        centrality: Centrality.PRESENT,
        explanation: "A price premium in a specific cluster of high-income Northern/Western European economies that survives even after controlling for how rich they are — something beyond income keeps prices there above what GDP alone predicts.",
        dataInsight: "Checked on a GDP-adjusted basis across the full panel: Switzerland (+48.5%), Norway (+33.6%), Britain (+33.1%), Euro area (+29.1%), Sweden (+26.6%), and Denmark (+19.7%) all show a premium that survives after removing the part GDP alone would predict. This corrects an earlier, narrower version of this concept ('The Wealthy Surcharge') that only checked 2 countries on raw price and wrongly implied high-GDP nations broadly carry a premium — the 10 highest-GDP countries in the panel actually average 10.3% *below* the US price on a raw basis. The real pattern is this specific 6-country cluster, not GDP rank generally.",
        evidenceGrounded: true,
        source: "The Economist Big Mac Index (github.com/TheEconomist/big-mac-data), Jul 2026, GDP-adjusted",
        category: "Economic Status",
        isAIConfirmed: true,
        logic: `concept "Northern European Premium"
  is a: regional_pattern
  context: "High-income economy price dynamics, Northern/Western Europe specifically"
  mechanism: "unconfirmed beyond productivity — plausibly wage-floor regulation or non-tradable service structure common to this cluster, not independently verified"
  evidence: "6-country cluster (Switzerland, Norway, Britain, Euro area, Sweden, Denmark) all show +20% to +49% premium after GDP-adjustment"
  covers:
    explains: [regional_price_premium]
    replaces: "The Wealthy Surcharge"
  relation:
    direction: downstream
    of: "Parity Reversion"
    via: sustained_deviation
  scope: regional`
      },
      {
        id: "bm-9",
        word: "Defensive Currency Premium",
        centrality: Centrality.PRESENT,
        explanation: "A cluster of countries, unrelated by income level, that are priced well above what their GDP predicts — plausibly linked to recent inflation-fighting monetary policy in each, though that specific mechanism isn't independently confirmed.",
        dataInsight: "Open-coded from a full sweep of the panel: Uruguay (+77.4%), Colombia (+63.6%), Turkey (+38.7%), Costa Rica (+38.1%), Israel (+35.2%), Mexico (+25.4%), Argentina (+19.0%), and Poland (+19.3%) all show a large positive residual after GDP-adjustment, despite spanning GDP from $8.4k to $56k — income doesn't unify this group, so the earlier per-country stories don't hold. This absorbs and replaces two earlier, thinner concepts: 'Contractionary Strength' (n=3: Colombia, Costa Rica, Israel) and 'Logistical Premia' (claimed tariffs explained Uruguay/Colombia/Mexico's premium, a mechanism that was never actually checked). All 5 of Logistical Premia's and Contractionary Strength's named countries turn out to be members of this single, larger, better-evidenced cluster. The shared mechanism (defensive interest-rate policy) is plausible given each country's recent inflation history but not independently verified — real central bank rate data was not reachable to check.",
        evidenceGrounded: true,
        source: "The Economist Big Mac Index (github.com/TheEconomist/big-mac-data), Jul 2026, full panel sweep",
        category: "Currency Dynamics",
        isAIConfirmed: true,
        logic: `concept "Defensive Currency Premium"
  is a: tension
  context: "Currency premium decoupled from income level"
  mechanism: "unconfirmed — plausibly defensive interest-rate policy (rate hikes to fight inflation) common across each member's recent history, not independently verified against real rate data"
  evidence: "8 countries (Uruguay, Colombia, Turkey, Costa Rica, Israel, Mexico, Argentina, Poland), GDP $8.4k-$56k, all +19% to +77% after GDP-adjustment"
  covers:
    explains: [income_independent_premium]
    replaces: "Contractionary Strength, Logistical Premia"
  relation:
    direction: downstream
    of: "Parity Reversion"
    via: sustained_deviation
  scope: dataset-specific`
      },
      {
        id: "bm-5",
        word: "Monetary Inertia",
        centrality: Centrality.PRESENT,
        explanation: "The temporal gap where exchange rates resist immediate adjustment to changes in local purchasing power, creating temporary 'Value Pockets'. Distinct from Defensive Currency Premium: this is about short-term volatility over time, not a sustained price level.",
        dataInsight: "Verified across the time series: Argentina's Big Mac valuation swung from 32.6% undervalued (Jan 2024) to 20.1% overvalued (Jan 2025) to 9.6% undervalued (Jan 2026) — a 50+ point swing in two years, real short-term volatility disconnected from a stable PPP trend.",
        evidenceGrounded: true,
        source: "The Economist Big Mac Index (github.com/TheEconomist/big-mac-data), 2024-2026 time series",
        category: "Analysis Metrics",
        isAIConfirmed: true,
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
    of: "Parity Reversion"
    via: speculative_friction
  contrasts_with: "Defensive Currency Premium"
  scope: global`
      },
      {
        id: "bm-6",
        word: "Integrated Parity",
        centrality: Centrality.EDGE_CASE,
        explanation: "The tendency for nations within shared trade blocs (like the Eurozone) to maintain near-zero variance in standardized good prices. Downgraded to Edge Case: it has never actually been checked against real data.",
        dataInsight: "Not checkable against this dataset: The Economist reports the Eurozone as a single aggregated 'Euro area' row rather than disaggregating member countries, so internal Eurozone price variance can't be verified from this sample. Kept on the board only as an explicitly flagged, unverified claim — a Present-level tile sitting next to evidence-checked ones while itself unchecked was a method inconsistency, corrected here.",
        evidenceGrounded: false,
        source: "Geopolitical Groups (unverified claim, not re-checked)",
        category: "Geopolitical Groups",
        isAIConfirmed: true,
        logic: `concept "Integrated Parity"
  is a: stabilizer
  context: "Trade bloc price convergence"
  mechanism: "market integration and shared regulatory frameworks force price transparency and competition"
  evidence: "Eurozone price distribution clustering — asserted, not independently checkable from this dataset"
  covers:
    explains: [regional_price_clusters]
    replaces: "Neighboring Parity"
  relation:
    direction: upstream
    of: "Monetary Inertia"
    via: market_fluidity
  scope: regional`
      }
    ],
    cachedExpansion: [
      {
        id: "bm-exp-1",
        word: "Development-Adjusted PPP",
        centrality: Centrality.DOMINANT,
        explanation: "The technique that isolates 'true' currency overvaluation by regressing prices against a country's development level — this is exactly the method used to derive every 'GDP-adjusted' figure across this board's tiles.",
        dataInsight: "This is not a separate hypothesis — it's the tool that produced the board. The Economist's own GDP-adjusted index was used directly: e.g., Sweden's raw valuation (+15.1%) looks modest, but its GDP-adjusted valuation (+26.6%) shows the naive PPP reading actually understates how much of its price sits outside what income explains. Every DOMINANT/PRESENT tile above cites this adjustment.",
        evidenceGrounded: true,
        source: "The Economist Big Mac Index Adjusted methodology (github.com/TheEconomist/big-mac-data), Jul 2026",
        category: "Method",
        isAIConfirmed: true,
        logic: `concept "Development-Adjusted PPP"
  is a: method
  context: "Separating productivity-driven price levels from residual currency effects"
  mechanism: "regressing price on GDP per capita and reading the residual, rather than reading raw price gaps directly"
  evidence: "Used throughout this board: Asian Currency Suppression, Northern European Premium, and Defensive Currency Premium are all defined on the GDP-adjusted residual, not raw price"
  covers:
    explains: [productivity_stripped_valuation]`
      },
      {
        id: "bm-exp-2",
        word: "The Commodity Floor",
        centrality: Centrality.EDGE_CASE,
        explanation: "The claim that globalized input costs (beef, wheat) create a price floor, with local labor/rent explaining the rest — flagged here because the specific number attached to it is contradicted by this board's own findings.",
        dataInsight: "The original claim asserted '60% of price variance comes from local labor and rent' but this was never checked, and this session's confound-controlled analysis contradicts it directly: GDP/labor cost explains at most ~25% of the undervaluation gap for the Asian Currency Suppression cluster, and 0% of Taiwan's. Kept on the board only as a flagged, disconfirmed claim — rejection is insight, not something to quietly delete.",
        evidenceGrounded: false,
        source: "Global Commodity Audit (unverified, contradicted by this session's re-grounding)",
        category: "Input Costs",
        isAIConfirmed: false,
        logic: `concept "The Commodity Floor"
  is a: baseline
  context: "Tradable vs Non-tradable inputs"
  mechanism: "globalized supply chains for food staples create a theoretical price floor that is violated by local productivity gaps — asserted, not verified"
  evidence: "No direct check performed; the specific '60% from labor/rent' figure is contradicted by this board's Asian Currency Suppression finding (GDP/labor explains ≤25% of the equivalent gap)"
  replaces: "The Google Index"`
      },
      {
        id: "bm-3-exp",
        word: "Capital Flow Friction",
        centrality: Centrality.EDGE_CASE,
        explanation: "The claim that sudden hot-money flows can temporarily crash or spike a currency's burger-value — plausible, but never independently checked against real data.",
        dataInsight: "No dataInsight was ever produced for this tile — no intraday FX or interest-rate-announcement data was available to check it. Flagged as unverified rather than removed, consistent with the rest of this board's re-grounding pass.",
        evidenceGrounded: false,
        source: "Capital Flow Audit (unverified)",
        category: "Market",
        isAIConfirmed: false,
        logic: `concept "Capital Flow Friction"
  is a: noise_driver
  context: "Volatility-driven decoupling"
  mechanism: "speculative capital moves faster than price indices, creating short-term statistical artifacts — asserted, not verified"
  evidence: "No data check performed"
  replaces: "Currency Pegs"`
      }
    ],
    threads: [
      {
        id: "bm-thread-1",
        title: "Deviations from the Baseline",
        conceptWords: ["Parity Reversion", "Northern European Premium", "Asian Currency Suppression", "Defensive Currency Premium"],
        synthesis: "Currency movements mostly offset local price changes (Parity Reversion) — the real story is the three distinct, evidence-checked ways a minority of countries break from that baseline: a specific rich-Europe cluster, a region-wide Asian pattern independent of income, and a cluster of countries sharing plausible currency-defense pressure regardless of how rich they are.",
        coheres: "yes",
      },
      {
        id: "bm-thread-2",
        title: "Volatility vs. Level",
        conceptWords: ["Monetary Inertia", "Defensive Currency Premium"],
        synthesis: "Two different axes of the same underlying stress: Monetary Inertia is about how much a currency swings over time; Defensive Currency Premium is about where it sits on average. A country (Turkey, Argentina) can show both at once without it being the same finding twice.",
        coheres: "yes",
      },
      {
        id: "bm-thread-unaddressed",
        title: "Unaddressed",
        conceptWords: [],
        synthesis: "Local Labor Anchor was proposed and rejected this session: GDP per capita alone doesn't reliably predict price — Taiwan (GDP $98k) is the single most undervalued country on the panel, and GDP-adjustment explains 0% of its gap, directly contradicting a labor-cost story. Rejection is insight, not a gap to hide. Separately, 9 countries (Ukraine, Egypt, South Africa, Jordan, Romania, Oman, Qatar, Kuwait, Pakistan) show the same undervaluation direction as Asian Currency Suppression but were deliberately excluded from that concept: constant comparison shows they don't share one mechanism (Ukraine plausibly war disruption, Egypt an IMF-linked devaluation, the Gulf states a dollar-peg/expat-labor structure) — grouping them by shared statistical sign alone would repeat the exact error this board's retired concepts made. A further 18 countries fall in the |adjusted valuation| ≤ 15% middle ground and haven't been examined for structure at all. Integrated Parity also remains unverified. The board is not claiming completeness — this is the honest edge of what today's evidence supports.",
        coheres: "no",
        isResidual: true,
      },
    ],
    metrics: {
      cohesion: 94,
      coverage: 88,
      entropy: 30,
      sharpness: 92,
      explanation: "The board separates the baseline currency-price relationship (Parity Reversion, the core category) from three real, mechanism-distinct deviations from it — a specific rich-Europe premium, a broad Asian undervaluation pattern independent of income, and a currency-defense cluster unrelated to income level — while explicitly retiring three originally-proposed concepts (The Emerging Discount, Local Labor Anchor, Logistical Premia) that didn't survive comparison against the full 52-country panel.",
      synthesis: "Currency movements mostly offset local price changes — the deviations from that baseline cluster into three distinct, evidence-checked patterns, not one generic 'rich vs. poor' story.",
      emergentPatterns: ["Regional undervaluation independent of income level", "Multiple deviation mechanisms from one shared baseline"],
      links: [
        { source: "Parity Reversion", target: "Northern European Premium", label: "Baseline for" },
        { source: "Parity Reversion", target: "Asian Currency Suppression", label: "Baseline for" },
        { source: "Parity Reversion", target: "Defensive Currency Premium", label: "Baseline for" },
        { source: "Monetary Inertia", target: "Defensive Currency Premium", label: "Different axis of" }
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
  scope: global`
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
  scope: global`
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
  scope: global`
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
  scope: global`
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
  scope: global`
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
  scope: global`
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
  scope: global`
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
  scope: global`
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
