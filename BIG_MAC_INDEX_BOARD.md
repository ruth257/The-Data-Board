# THE DATA BOARD: BIG MAC INDEX
## PROJECT SPECIFICATION & DEDUCIBLE SPACE

### SECTION 1: BOARD METRICS & SYNTHESIS
*   **Synthesis (The Global Story):** Global currency valuation is a structural outcome of the tension between The Wealthy Surcharge and The Emerging Discount. This board moves beyond simple price comparison to map the systemic price distortions inherent in global geography.
*   **Analytical Summary:** The board successfully maps the tug-of-war between high-income price drivers and emerging market undervaluation.
*   **Emergent Patterns:** 
    *   Purchasing Power Asymmetry
    *   Policy-Driven Undervaluation
*   **Cohesion:** 96%
*   **Coverage:** 90%
*   **Entropy:** 30%
*   **Sharpness:** 98%

---

### SECTION 2: RELATIONSHIP GRAPH (LINKS)
1.  **The Wealthy Surcharge** $\leftrightarrow$ (Contrasts) $\leftrightarrow$ **The Emerging Discount**
2.  **Local Labor Anchor** $\rightarrow$ (Inflates) $\rightarrow$ **The Wealthy Surcharge**
3.  **The Emerging Discount** $\rightarrow$ (Predicts) $\rightarrow$ **Policy Gap**

---

### SECTION 3: ANALYTICAL HANDLES (TILES)

#### [DOMINANT] THE WEALTHY SURCHARGE
*   **ID:** `bm-2`
*   **Category:** Economic Status
*   **Source:** Economic Status Audit
*   **Explanation:** The structural price increase observed in wealthy nations where higher wages and rents inflate the cost of standardized goods.
*   **Data Insight:** High-GDP nations consistently show a 30-50% price premium over the global average.
*   **Specificity Score:** 92
*   **YAML Logic:**
```yaml
concept "The Wealthy Surcharge"
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
    of: "The Emerging Discount"
    via: cost_inflation
  contrasts_with: "The Emerging Discount"
  scope: global
  fidelity: 0.95
  fidelity_basis: empirical_test
  valid_when:
    - "high GDP per capita"
    - "significant non-tradable sector"
```

#### [DOMINANT] THE EMERGING DISCOUNT
*   **ID:** `bm-3`
*   **Category:** Market Inequity
*   **Source:** Market Inequity Analysis
*   **Explanation:** The systemic undervaluation of currencies in emerging markets, making global goods appear cheaper in local terms.
*   **Data Insight:** Currencies in developing regions are often undervalued by 40-60% relative to the dollar benchmark.
*   **Specificity Score:** 90
*   **YAML Logic:**
```yaml
concept "The Emerging Discount"
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
    of: "The Wealthy Surcharge"
    via: valuation_gap
  contrasts_with: "The Wealthy Surcharge"
  scope: regional
  fidelity: 0.94
  fidelity_basis: semantic_density
  valid_when:
    - "developing economy status"
    - "currency undervaluation relative to PPP"
```

#### [PRESENT] LOCAL LABOR ANCHOR
*   **ID:** `bm-4`
*   **Category:** Structural Fundamentals
*   **Source:** Structural Fundamentals Audit
*   **Explanation:** The link between local productivity levels and the price of non-tradable inputs like labor and services.
*   **Data Insight:** Explains why price convergence is limited by structural differences in national productivity.
*   **Specificity Score:** 88
*   **YAML Logic:**
```yaml
concept "Local Labor Anchor"
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
    of: "The Wealthy Surcharge"
    via: wage_pressure
  contrasts_with: "Global Supply Chain"
  scope: global
  fidelity: 0.92
  fidelity_basis: empirical_test
  valid_when:
    - "labor-intensive production"
    - "local wage variance"
```

#### [PRESENT] MARKET LAG
*   **ID:** `bm-5`
*   **Category:** Analysis Metrics
*   **Source:** Volatility Analysis
*   **Explanation:** The resistance in exchange rates to adjust immediately to changes in local purchasing power.
*   **Data Insight:** Market volatility creates temporary gaps between 'burger' value and 'fiat' value.
*   **Specificity Score:** 85
*   **YAML Logic:**
```yaml
concept "Market Lag"
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
    of: "The Emerging Discount"
    via: temporal_friction
  contrasts_with: "Instant Parity"
  scope: dataset-specific
  fidelity: 0.88
  fidelity_basis: semantic_density
  valid_when:
    - "high market volatility"
    - "capital flow dominance"
```

#### [PRESENT] NEIGHBORING PARITY
*   **ID:** `bm-6`
*   **Category:** Geopolitical Groups
*   **Source:** Geopolitical Audit
*   **Explanation:** The tendency for neighboring countries with similar economic profiles to share consistent price levels.
*   **Data Insight:** Eurozone nations show high internal parity despite varying local labor costs.
*   **Specificity Score:** 82
*   **YAML Logic:**
```yaml
concept "Neighboring Parity"
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
    - "geographic proximity"
```

#### [EDGE CASE] SUPPLY CHAIN FRICTION
*   **ID:** `bm-7`
*   **Category:** Outlier Detection
*   **Source:** Outlier Detection Audit
*   **Explanation:** Outliers where local supply chain failures or extreme taxes decouple the price from economic fundamentals.
*   **Data Insight:** Observed in markets with high import tariffs or hyper-local logistics bottlenecks.
*   **Specificity Score:** 95
*   **YAML Logic:**
```yaml
concept "Supply Chain Friction"
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
    of: "The Wealthy Surcharge"
    via: price_distortion
  contrasts_with: "Free Trade Flow"
  scope: dataset-specific
  fidelity: 0.90
  fidelity_basis: empirical_test
  valid_when:
    - "high import tariffs"
    - "logistical bottlenecks"
```

#### [EDGE CASE] POLICY GAP
*   **ID:** `bm-8`
*   **Category:** Currency Risk
*   **Source:** Currency Risk Audit
*   **Explanation:** The extreme decoupling of a currency's market value from its actual purchasing power due to policy intervention.
*   **Data Insight:** Significant in nations with artificial currency pegs or capital controls.
*   **Specificity Score:** 92
*   **YAML Logic:**
```yaml
concept "Policy Gap"
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
    of: "The Emerging Discount"
    via: policy_intervention
  contrasts_with: "Market Transparency"
  scope: dataset-specific
  fidelity: 0.92
  fidelity_basis: expert_judgment
  valid_when:
    - "capital controls in place"
    - "managed float or fixed peg"
```
