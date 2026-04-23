# The Data Board

**Given a good enough set of semantics — can we use language to represent data?**

**[▶ Try the live app](https://thedataboard.ai)** | **[📖 Full methodology](methodology.html)** | **[🎯 Run a workshop](workshop.html)**

---

> Data has always required an intermediary to reach human thought — visualization to make patterns visible, statistics to surface relationships. Both approaches are bottom-up: they start from the numbers and work toward meaning.
>
> Large language models may be the pivotal moment that changes this. Trained on the accumulated written knowledge of human civilisation, they encode domain semantics at a scale and accessibility that has never existed before. For the first time, a good enough semantic representation of virtually any domain is computationally available in real time.
>
> What if we used that to go top-down instead? Start with synthesized semantics — a vocabulary derived from the corpus that, under the right conditions, is good enough to represent the data in question. Let the language frame the analysis before the numbers begin.
>
> Data analysis produces findings. But findings without shared vocabulary produce arguments, not decisions. Five people look at the same dashboard and leave with five different theories — not because the data is wrong, but because the concepts were never agreed upon. The Data Board builds the vocabulary before the analysis begins.

---

## Method flow & examples

The diagram below shows the four-step method. Both real boards follow — Big Mac Index and World Happiness 2025 — with sources linked.

See the [full methodology →](METHODOLOGY.md)

---

## Examples (text)

### Big Mac Index — naming what the numbers mean

**The dataset:** Big Mac prices in local currency across 50+ countries · USD equivalent · implied PPP exchange rate

**The question:** What structural conditions explain the persistent gap between market exchange rates and purchasing power parity?

**Pseudo-antonym© pair at the heart of the board:**

```
The Wealthy Surcharge ↔ The Emerging Discount
```

**The board**

```
DOMINANT
The Wealthy Surcharge 30–50% price premium in high-GDP nations (Balassa-Samuelson)
The Emerging Discount 40–60% currency undervaluation in developing regions

PRESENT
Local Labor Anchor Productivity differences cap convergence
Market Lag Exchange rates resist immediate PPP adjustment
Neighboring Parity Eurozone nations cluster internally despite varying local costs

EDGE CASE
Supply Chain Friction Outliers where import tariffs decouple price from fundamentals
Policy Gap Central bank intervention creates deducible gap: market ≠ real value
```

**Board metrics:** Cohesion 96 · Coverage 90 · Sharpness 98

**The deduction**

> *"Global currency valuation is a structural outcome of the tension between The Wealthy Surcharge and The Emerging Discount. The numbers were always there. The board names the mechanism."*

---

### World Happiness 2025 — inverting the standard narrative

**The dataset:** GDP per capita · social support · healthy life expectancy · freedom · generosity · corruption perceptions (140+ countries)

**The question:** What structural conditions explain why high GDP does not guarantee high happiness?

**Pseudo-antonym© pairs at the heart of the board:**

```
Institutional Trust ↔ Systemic Distress
Individual Freedom ↔ Atomized Autonomy
```

**The board**

```
DOMINANT
Economic Security GDP/capita: 0.82 correlation with happiness above $40k
Social Cohesion Social support: 33% of variance in national happiness averages
Healthy Life Expectancy Each added year = +0.15 to national happiness score

PRESENT
Institutional Trust Low corruption correlates with high freedom (r=0.65)
Individual Freedom Nordic nations score highest; consistently lead the index
Generosity Charitable giving correlates with higher positive affect

EDGE CASE
Systemic Distress Happiness gap between top/bottom 20% widening in 60% of nations
Atomized Autonomy High freedom cultures: 15% higher reported loneliness
The Freedom Gap Legal rights without economic capacity to exercise them
```

**Board metrics:** Cohesion 88 · Coverage 92 · Sharpness 90

**The deduction**

> *"Global well-being is a structural outcome of the balance between Institutional Trust and Individual Freedom. High GDP is necessary but not sufficient — Atomized Autonomy is the shadow of Individual Freedom that GDP cannot measure."*

---

## Use it now

Copy this system prompt into any LLM (Claude, ChatGPT, Gemini):

```
You are applying the Data Board methodology, created by Ruth Aharon (thedataboard.ai).

Your role: Inquisitor, not Author.
Do not generate vocabulary. Evaluate vocabulary I propose.

When I propose a concept, check whether it is:
(a) descriptive not evaluative — does it describe a condition or embed a conclusion?
(b) domain-coherent — does it fit with other accepted concepts?
(c) evidentially grounded — is it consistent with what is known about this domain?

For each accepted concept, identify its Pseudo-Antonym© — the structural
opposite in this domain. These tension pairs are where the non-trivial narrative lives.

Assign each accepted concept a weight:
Dominant — primary driver of the pattern
Present — real factor, not decisive
Edge Case — marginal or structural outlier

When you reject a concept, explain why. Rejection reveals hidden assumptions.

Workflow:
1. I propose candidate concepts. You evaluate each one.
2. We identify pseudo-antonym© pairs among accepted concepts.
3. The board assembles with weighted concepts.
4. Optional: split the board by outcome. Read the inversions.

Ready? Share your dataset and question.
```

---

## How it works

Large language models encode the accumulated domain knowledge of human civilisation. When an LLM evaluates "The Emerging Discount" in the context of global currency data, it draws on everything humans have written about purchasing power parity, emerging market economics, and exchange rate theory. That is not a language operation. It is a knowledge retrieval operation.

The Data Board uses this to build **on-the-fly minimal ontologies** — the smallest coherent set of concepts sufficient to reason about a specific question on a specific dataset. A concept earns its place on two dimensions:

| Dimension | Meaning | Statistical analogy |
|-----------|---------|-------------------|
| **Relevance** | How densely the concept clusters with the domain in LLM semantic space | Correlation with target variable |
| **Cohesiveness** | How well the concept fits with the rest of the accepted vocabulary | Correlation between features |

**The principle: AI generates or human proposes. AI evaluates. Human decides.**

---

## Core concepts

**Deducible Space** — the minimal set of grounded, coherent, tension-bearing concepts from which consistent narrative conclusions follow inevitably.

**Pseudo-Antonyms©** — concept pairs occupying opposite ends of the same analytical dimension. Not logical opposites — structurally opposing concepts within a shared domain. The mechanism that makes deductions inevitable rather than inferred.
*© Ruth Aharon — attribution required when citing.*

**Goldilocks Handle** — a concept at the right level of abstraction: precise enough to be grounded in evidence, general enough to reason from. "The Wealthy Surcharge" is a Goldilocks handle — it names a mechanism (systematic price premium driven by the Balassa-Samuelson effect), compresses a pattern across 50+ countries into a single reasoned-about type, and creates structural tension against its pseudo-antonym. "Countries that are rich" is not — it describes membership in a category, implies no mechanism, and generates no analytical direction.

**Verification Shift** — when human vocabulary is supplied, the AI moves from invention to verification: checking whether concepts are grounded, coherent, and descriptive rather than generating them freely.

---

## Theoretical anchors

- **Pearl & Mackenzie (2018).** *The Book of Why.* — Pearl's ladder shows reasoning beyond association requires causal tools. The Data Board addresses the prerequisite Pearl assumes is solved: knowing which concepts belong in the model.

- **Glaser & Strauss (1967).** *The Discovery of Grounded Theory.* — Open coding and axial coding are the qualitative precedents. The Data Board operationalises these steps computationally — weeks compressed into a session.

- **Luhn (1958).** "A Business Intelligence System." — Intelligence as "guiding action toward a desired goal." The Data Board formalises the naming step that makes the goal speakable.

---

## Contribute

The methodology is open. The hypothesis is testable.

We are looking for:
- **Analysts and data journalists** — run the method on real datasets and share what the board produced
- **Researchers** — the semantic density hypothesis is open: can corpus-derived concept density predict feature importance before measurement?
- **Developers** — build tooling, integrations, or automated board generation

Open an issue, submit a PR, or reach out at [thedataboard.ai](https://thedataboard.ai).

---

## License

The Data Board methodology is released under the **[MIT License](https://opensource.org/licenses/MIT)** — free for commercial and non-commercial use, modification, and distribution.

The term **Pseudo-Antonyms©** is a proprietary conceptual framework created by Ruth Aharon. Attribution is required when using or citing this concept.

**Cite as:** Aharon, R. (2026). *The Data Board: A Methodology for Language-Based Data Analysis.* thedataboard.ai

---

*The Data Board was created by [Ruth Aharon](https://thedataboard.ai). Try the interactive version at [thedataboard.ai](https://thedataboard.ai)*
