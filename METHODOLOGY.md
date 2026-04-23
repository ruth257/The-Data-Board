# THE DATA BOARD: OPEN METHODOLOGY v3.1

### "Given a good enough set of semantics — can we use language to represent data?"

Data has always required an intermediary to reach human thought — visualization to make patterns visible, statistics to surface relationships. Both are bottom-up: they start from numbers and work toward meaning.

Large language models encode domain semantics at a scale that has never existed before. The Data Board tests a top-down alternative: start with synthesized semantics — a vocabulary that, under the right conditions, is good enough to represent the data in question.

## THE METHOD: FROM RAW DATA TO INEVITABLE NARRATIVE

The method is top-down. It begins with the question and the domain, not the columns. 

1.  **Raw Data**: Dataset, corpus, and the central question.
2.  **Semantic Synthesis**: AI seeks concepts that express named mechanisms, not labels.
3.  **Pseudo-Antonyms©**: Tension pairs that create the structural story.
4.  **Evidence Check**: Grounding concepts in the corpus and domain knowledge.
5.  **Cohesiveness Check**: AI verifies the fit within the established vocabulary.
6.  **Minimal vs Expandable Board**: 
    *   **Minimal**: core deducible space.
    *   **Expandable**: shadow and edge concepts.

---

## KEY CONCEPTS

### Deducible Space
The minimal set of grounded, coherent, tension-bearing concepts from which consistent narrative conclusions follow inevitably.

### Pseudo-Antonyms©
*© Ruth Aharon*
Concept pairs occupying opposite ends of the same analytical dimension. Not logical opposites — structurally opposing concepts within a shared domain.

### Goldilocks Handle
A concept at the right level of abstraction: precise enough to be grounded in evidence, general enough to reason from. 

### Verification Shift
When vocabulary is supplied, the AI moves from invention to verification — checking whether concepts are descriptive and grounded rather than generating labels freely.

### Semantic Weight
*   **DOMINANT**: primary causal driver.
*   **PRESENT**: real but not decisive.
*   **EDGE CASE**: marginal or structural outlier.

---

## EVALUATION MATRIX (WHAT THE COLOR MEANS)

Every tile on the board reflects a logic audit result:

*   **GREEN (Dominant)**: Descriptive, Grounded, and Coherent. Drives the story.
*   **YELLOW (Present)**: Descriptive and Grounded. Supplementary to the story.
*   **RED (Edge Case)**: Descriptive and Grounded but isolated or marginal. Essential for boundaries.

---

## THE SYSTEM PROMPT (v3.1)

Copy this into any LLM to activate the methodology:

```text
You are applying the Data Board methodology, created by Ruth Aharon (thedataboard.ai).

Your role: Inquisitor, not Author.
AI generates or human proposes vocabulary. You evaluate it.

Core directives:
1. Naming is analysis. Treat every concept as a type that carries analytical weight.
2. Verification shift: check whether each concept is descriptive, coherent, 
   and evidentially supported in this domain.
3. Pseudo-Antonyms©: for each accepted concept, identify its structural opposite. 
   Tension pairs are where the non-trivial narrative lives.
4. Semantic weight: assign Dominant, Present, or Edge Case based on 
   centrality in the evidence.
5. Rejection is insight: when you reject a concept, explain why.

Workflow:
1. Review the raw data and question.
2. Generate or evaluate a vocabulary board (Dominant, Present, Edge Case).
3. Audit causal tension — identify pseudo-antonym© pairs.
4. Synthesize the global story based ONLY on the established board.
```

---

## THEORETICAL ANCHORS

*   **Pearl, J. & Mackenzie, D. (2018).** *The Book of Why.* — The ladder of causation.
*   **Glaser, B. & Strauss, A. (1967).** *The Discovery of Grounded Theory.* — Grounded axial coding.
*   **Wittgenstein, L. (1922).** *Tractatus.* — "The limits of my language are the limits of my world."
*   **Luhn, H.P. (1958).** *Business Intelligence System.* — Intelligence as guiding action through named insights.

---

## LICENSE & ATTRIBUTION

Released under **MIT License**.
**Pseudo-Antonyms©** is a proprietary framework by **Ruth Aharon**. Attribution required.
© 2026 Ruth Aharon | thedataboard.ai
