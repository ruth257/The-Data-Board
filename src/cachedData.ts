import { Tile, Centrality, BoardMetrics, NarrativeThread } from "./types";

// Bump this whenever CACHED_BOARDS content changes meaningfully. The app
// clears any locally-saved board that predates this version, so returning
// visitors see fresh cached data instead of a permanently stale local copy.
export const CACHED_DATA_VERSION = "12";

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
  seed: "Income"
  is_a: baseline
  mechanism: "wealth buys agency, not just survival"
  evidence: "r=0.745, n=147"
  downstream: "Agency Capacity, Agency-Resource Gap"
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
  seed: "Social Support"
  is_a: buffer
  mechanism: "trusted networks buffer the psychological cost of crisis"
  evidence: "r=0.805, n=147 — strongest of six factors"
  downstream: "Digital Fragmentation"
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
  seed: "Corruption"
  is_a: foundation
  mechanism: "transparent institutions reduce systemic anxiety"
  evidence: "r=0.392, n=147 — weakest of five major factors"
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
  seed: "Life Expectancy"
  is_a: prerequisite
  mechanism: "physical health enables active participation"
  evidence: "r=0.678, n=147"
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
  seed: "Freedom"
  is_a: driver
  mechanism: "aligning values with action reduces friction"
  evidence: "Viet Nam 1.147 (highest); Singapore 0.980 (rank 50/146)"
  upstream: "Resource Elasticity"
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
  seed: "Freedom vs. Income"
  is_a: tension
  mechanism: "formal rights are hollow without real means to use them"
  evidence: "Singapore: GDP #1, freedom rank 50/146"
  upstream: "Resource Elasticity"
  scope: global`
      },
      {
        id: "h-7",
        word: "Digital Fragmentation",
        centrality: Centrality.EDGE_CASE,
        explanation: "The erosion of physical social cohesion through hyper-individualized digital consumption.",
        dataInsight: "Knowledge-grounded (not a row in this panel): country is already a key in this exact WHR data, and it's a well-established pattern — not an invented statistic — that the panel's higher-income countries (the Nordic states, East Asia, North America) have near-universal internet access and much heavier digital-social substitution than its lower-income countries. Real and checkable about the countries already on this board, even though the panel itself carries no internet-usage or screen-time column to measure it directly.",
        evidenceGrounded: true,
        source: "Knowledge-grounded: well-established country-level internet-access and digital-substitution patterns, enriching the WHR panel's own country data — not a row in the panel itself.",
        category: "Technology",
        logic: `concept "Digital Fragmentation"
  seed: "Screen Time"
  is_a: risk
  mechanism: "algorithmic sorting erodes shared physical experience"
  evidence: "high-income vs. low-income connectivity gap — knowledge-grounded, not a panel row"
  upstream: "Communal Insulation"
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
  seed: "Tradition"
  is_a: stabilizer
  mechanism: "shared ritual buffers against societal change"
  evidence: "Israel #8, Mexico #12"
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
  seed: "PPP"
  is_a: core_category
  mechanism: "currencies offset domestic price changes (short-run PPP)"
  evidence: "r=-0.944, n=53"
  downstream: "Northern European Premium, Asian Currency Suppression, Defensive Currency Premium"
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
  seed: "Undervaluation"
  is_a: regional_pattern
  mechanism: "unconfirmed — policy or structural export orientation"
  evidence: "13/13 Asian economies negative; mean -37.1% vs +6.1%"
  upstream: "Parity Reversion"
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
  seed: "Rich Countries"
  is_a: regional_pattern
  mechanism: "unconfirmed — wage-floor regulation or service structure"
  evidence: "6 countries, +20% to +49% post-adjustment"
  upstream: "Parity Reversion"
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
  seed: "Inflation"
  is_a: tension
  mechanism: "unconfirmed — plausibly defensive rate hikes"
  evidence: "8 countries, +19% to +77% post-adjustment"
  upstream: "Parity Reversion"
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
  seed: "Volatility"
  is_a: lag
  mechanism: "capital flight and rate spreads bypass PPP short-term"
  evidence: "Argentina: -32.6% → +20.1% → -9.6% (2024-2026)"
  upstream: "Parity Reversion"
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
  seed: "Trade Blocs"
  is_a: stabilizer
  mechanism: "market integration forces price transparency"
  evidence: "not independently checkable — Euro area reported as one row"
  downstream: "Monetary Inertia"
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
  seed: "GDP Adjustment"
  is_a: method
  mechanism: "regress price on GDP, read the residual"
  evidence: "used to derive every GDP-adjusted figure on this board"`
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
  seed: "Input Costs"
  is_a: baseline
  mechanism: "asserted price floor from tradable input costs"
  evidence: "unverified; contradicted by Asian Currency Suppression (≤25% not 60%)"`
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
  seed: "Hot Money"
  is_a: noise_driver
  mechanism: "speculative capital moves faster than price indices"
  evidence: "no data check performed"`
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
  seed: "Clerical Work"
  is_a: driver
  mechanism: "symbolic text has zero mechanical inertia for LLMs"
  evidence: "Correspondence Clerks, Proofreaders: 0.95-1.00 model, agree only at broadest tier"
  upstream: "Programming Exposure, Semantic Transference"
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
  seed: "Manual Labor"
  is_a: barrier
  mechanism: "embodied action needs robotics text models can't simulate"
  evidence: "160/923 occupations (17%) below 0.05 exposure on both scales"
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
  seed: "Rater Disagreement"
  is_a: tension
  mechanism: "gap runs both directions depending on the occupation"
  evidence: "r=0.435; Court Reporters 0.92 vs 0.12, Survey Researchers 0.25 vs 0.75"
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
  seed: "Legal Judgment"
  is_a: constraint
  mechanism: "liability and clinical judgment resist automation on both scales"
  evidence: "Judges, Physician Assistants, Nurse Anesthetists: ~0.00 both raters"
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
  seed: "Creativity"
  is_a: risk
  mechanism: "the model rates its own creative output higher than humans do"
  evidence: "model 0.89 vs human 0.67 (direct-exposure tier); r=0.88-0.91 board-wide"
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
  seed: "Fieldwork"
  is_a: stabilizer
  mechanism: "unresolved — model and human raters disagree, confound not cleared"
  evidence: "model 0.00-0.12 vs human 0.43-0.75 for the same occupations"
  upstream: "Physical Anchor"
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
  seed: "Coding"
  is_a: driver
  mechanism: "rigid compilation rules speed up AI auto-correction"
  evidence: "model 0.93-0.95 (beta tier); human ratings lower and mixed (0.63-0.68)"
  downstream: "Syntactic Sandbox"
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
  seed: "Translation"
  is_a: risk
  mechanism: "pure text conversion needs no real-world agency"
  evidence: "Interpreters/Translators: 0.88 model, 0.80 human"
  downstream: "Syntactic Sandbox"
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
  },
  "tel-aviv-106-hotline": {
    tiles: [
      {
        id: "ta106-1",
        word: "Crisis Anchor",
        centrality: Centrality.DOMINANT,
        explanation: "Under acute stress, people default to the most familiar number they already have saved — not the technically correct emergency channel. A real pattern in crisis-communication behavior, not just 'there's a lot of emergency-tagged volume.'",
        dataInsight: "Emergency-cluster labels total 116,021 requests (9.4% of all 1,238,766 contacts in the dataset), led by \"חירום - אזרחים ותיקים\" (Emergency – Senior Citizens, 85,013) — the second-largest single label of all 704. Caveat: 73% of this concept's volume rests on that one label, and its precise meaning (general emergency intake routed through a senior-citizens queue, vs. a dedicated senior-emergency welfare service) can't be resolved from the label text alone. The supporting cluster (shelters, evacuees, checkpoints, missile-attack reports) independently confirms a real crisis-channel signal regardless of that ambiguity.",
        evidenceGrounded: true,
        source: "Tel Aviv Municipality 106 call center, 704 level-3 request labels with incident volumes, 2025-2026",
        category: "Civic Behavior",
        logic: `concept "Crisis Anchor"
  seed: "Emergency Calls"
  is_a: driver
  mechanism: "under stress, callers default to the number they already know"
  evidence: "116,021 / 1,238,766 (9.4%); 73% rests on one ambiguous label"
  scope: dataset-specific`
      },
      {
        id: "ta106-2",
        word: "Affected-Party Bias",
        centrality: Centrality.PRESENT,
        explanation: "Citizen-reporting systems structurally over-represent complaints that acutely, personally inconvenience the reporter, versus diffuse violations with no immediate victim — a documented pattern in civic-reporting (311-style) literature, with a real downstream consequence: resource allocation driven by this reporting mix under-serves issues nobody personally suffers enough to report.",
        dataInsight: "Access-obstruction parking complaints (car parked on sidewalk, blocking entrance/parking, obstructing traffic) total 84,934 requests (6.9%) — nine times the volume of permit/fee-type violations (disabled parking, ticket appeals: 9,293, 0.8%). The claim isn't 'there's a lot of blocked parking' — it's that the reporting channel itself is skewed toward whoever is personally affected right now.",
        evidenceGrounded: true,
        source: "Tel Aviv Municipality 106 call center, 704 level-3 request labels with incident volumes, 2025-2026",
        category: "Civic Behavior",
        logic: `concept "Affected-Party Bias"
  seed: "Parking Complaints"
  is_a: structural_bias
  mechanism: "reporting channels over-sample whoever is personally affected right now"
  evidence: "84,934 vs. 9,293 — a 9:1 ratio"
  scope: dataset-specific`
      }
    ],
    threads: [
      {
        id: "ta106-thread-unaddressed",
        title: "Unaddressed",
        conceptWords: [],
        synthesis: "The dataset's single largest label of all 704 (\"פינוי גזם ואשפה חריגה\" / excess garden-waste & garbage collection, 102,589) isn't claimed by either concept above — the data can't distinguish whether its size reflects real severity or just routine, low-effort, high-frequency demand, which is exactly the confound check a 'garbage is the city's biggest problem' claim would need to pass and can't from this data alone. A third candidate ('Routing Noise' — wrong numbers and disconnects, 45,532, 3.7%, the third-largest single label) was tested and rejected: a real fact, but not a serious, non-obvious claim — a mundane observation in academic dress. 682 of 704 labels (55.7% of total volume) remain deliberately unclaimed — a Deducible Space is the minimal set that survives the check, not an exhaustive classification of the input.",
        coheres: "no",
        isResidual: true,
      },
    ],
    metrics: {
      explanation: "Two grounded mechanisms surface above the noise of Tel Aviv's 106 hotline, 2025-2026: an emergency-driven default in caller behavior, and a structural bias in what parking violations get reported. Most of the dataset is deliberately left unclaimed rather than force-sorted into a category.",
      synthesis: "Contact with Tel Aviv's municipal hotline is shaped less by 'what needs fixing in the city' than by two structural mechanisms: what number people default to under stress, and who gets hurt personally enough to bother reporting.",
      emergentPatterns: ["Crisis behavior reshapes a routine-service channel's traffic mix", "Citizen-reporting systems are not a neutral sample of city problems"],
      synthesisSuggestions: []
    }
  }
};
