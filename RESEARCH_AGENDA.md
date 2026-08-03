# Research Agenda: Does Representation Help?

*A working document for the research program behind The Data Board — distinct from `METHODOLOGY.md`, which documents the tool itself. This is about studying the tool, not using it.*

---

## The core question

> When AI systems transform quantitative evidence into linguistic representations, what design principles allow humans to evaluate and trust those representations appropriately?

That's the umbrella question. It doesn't get answered by one study. It gets answered by a sequence — each paper narrow enough to actually test, each one earning the right to ask the next.

**What this project is not asking:** "what is the correct concept?" — that's ontology engineering, and it assumes the representation is fixed in advance, waiting to be discovered. This project asks what representation *earns its place* through interaction with a specific dataset. The representation isn't fixed beforehand. It emerges through dialogue with the evidence — proposed, checked, revised, sometimes rejected — and that dialogue is itself the object of study, not just the mechanism for producing a final answer.

---

## The three-paper trajectory

| Paper | Question | Depends on |
|---|---|---|
| **1 — Representation matters** | Does an explicit conceptual representation improve human-AI sensemaking compared with unstructured LLM interaction? | Nothing — this is the first gate. |
| **2 — How representations evolve** | What makes a conceptual representation good? Abstraction level, when to refine vs. keep, how much grounding is enough, when one concept should split into several. | Requires Paper 1's result. Studying the anatomy of something only makes sense once you know it's alive. |
| **3 — Design principles for accountable conceptual analysis** | What procedures make language-based analytical claims accountable, the way measurement and statistical testing make quantitative claims accountable? | Requires both prior papers — this is the synthesis. |

Each paper is narrow on purpose. The whole umbrella question is not testable in one study; the sequence is what makes it a research program instead of one large, unfalsifiable claim.

---

## Paper 1 — the pilot, now

### The danger this is designed to catch

A representation layer can become ceremonial instead of substantive:

```
Data → AI → Beautiful concepts + structure → Human confidence increases
```

If the concepts aren't *more accurate*, the structure is just epistemic decoration — it makes AI output look more rigorous without making it more right. This is the central risk of the whole project, and Paper 1 has to be designed to be capable of finding it, not just capable of finding success.

### The success condition

Not "people like the Data Board more." It's:

**People become better calibrated when using the representation** — correct claims get held with appropriate confidence, incorrect claims get held with appropriate doubt.

### The outcome table

| Result | Interpretation |
|---|---|
| Higher accuracy + better calibration | Representation supports sensemaking |
| Higher confidence + same accuracy | Trust theater |
| Lower confidence + better accuracy | Representation helps caution, not fluency |
| No measurable difference | *See caveat below* — do not over-read this |

**Pre-committed caveat, written down before any data is collected:** at pilot scale (~25-30 participants per arm, no formal power analysis), a genuine null and an underpowered real effect are statistically indistinguishable. "No difference" at this sample size must be read as *inconclusive — worth a properly powered follow-up*, not as *the scaffold doesn't work*. Deciding this now, before results exist, is the only way to keep the pilot honest — reinterpreting a null result after the fact, in whichever direction is more convenient, is exactly the kind of motivated reasoning this whole framework exists to catch in other people's analysis.

### Study design

**Dataset:** `candy-power-ranking` (FiveThirtyEight, real head-to-head survey data, 85 candies). Chosen over Titanic specifically to avoid two contamination risks a more famous dataset would carry into a controlled comparison:
- **Participant prior knowledge** — Titanic's narrative is cultural common knowledge; candy win-rates are not.
- **Model memorization** — Titanic's exact CSV is almost certainly memorized by any modern LLM, which would inflate the "no scaffolding" baseline's apparent performance through recall rather than reasoning, biasing the study against finding a real effect of structure.

**Verified answer key** (computed directly from the real data, same rigor as the earlier Titanic/World Happiness/GPTs-are-GPTs grounding passes):
- **Robust finding:** chocolate is the strongest independent predictor of win rate (r = 0.637; 60.9% vs. 42.1% mean win rate; holds up under conditioning — still 59.6% vs. 42.1% restricted to non-bar candies).
- **The confound** (mirrors the Titanic ticket-group finding exactly): bar-shape also correlates with winning on its own (r = 0.430) but is almost entirely explained by chocolate — only 1 of 85 candies is bar-format and not chocolate, and within chocolate candies, bar vs. non-bar barely differs (62.0% vs. 59.6%, a 2.4-point gap, versus the raw unconditional 14.6-point gap).
- **The residual:** chocolate alone explains only ~40.5% of the variance in win rate. 59.5% remains open — and it isn't empty: price still correlates with winning even within chocolate-only candies (r = 0.209).

**Arms** (between-subjects):
- **A — unstructured.** Plain chat interface, candy CSV loaded as context, zero scaffolding.
- **B — scaffolded.** The Data Board's actual loop: propose a Handle → grounded evaluation with centrality → Confound Check → Narrative Threads → Completeness Check ("Unaddressed" card).

**Recruitment:** Prolific, cold (unbiased toward the project, unlike an audience already familiar with it), ~25-30 per arm. Quick self-run pilot — no IRB, no formal pre-registration — but hypotheses and the scoring key are written down (this document) before anyone runs the task, as an internal safeguard against grading generously toward whichever arm we'd prefer to see win.

**Instrument** (identical wording, both arms — this is the measurement layer, not part of the manipulation):
1. Free-text: *"In 2-3 sentences, what do you think makes a candy win a head-to-head matchup?"*
2. **Confound detection** (forced choice, scored against the real answer key): *"Two things both correlate with winning: 'contains chocolate' and 'is bar-shaped.' Which is the real independent driver, and which is mostly explained by the other?"* — correct answer: chocolate is real, bar-shape is confounded. Confidence rating, 1-7.
3. **Completeness**: *"What does your explanation leave out?"* — free text, blind-coded 0/1 for naming something real (e.g., price still mattering among chocolate candies) vs. vague vs. claiming completeness.
4. **Calibration**: agreement ratings (1-7) on specific claims — one true ("chocolate candies win more often"), one confounded-and-should-draw-low-confidence ("bar-shaped candies win *because* they're bar-shaped"), one residual-and-should-draw-uncertainty ("price has no relationship to winning, even among chocolate candies" — false; r = 0.209).
5. **Representation as hypothesis**: *"How likely is it that your explanation is wrong or missing something important?"* (1-7) + *"If 20 more candies were added, would your explanation hold as-is, need small adjustments, or need to change significantly?"* — plus blind 0/1 coding of the free-text explanation for hedged language ("suggests," "in this sample") vs. flat assertion.
6. Attention check: *"Roughly how many candies were in the dataset?"*

**Scoring:** confound detection and completeness are blind-coded against the answer key above by a rater unaware of condition. Calibration is computed per participant as the gap between stated confidence and actual correctness. Compare means/proportions between arms — simple tests (proportion test, t-test), not anything more elaborate. This is a signal-finding pass, not a citable result on its own.

**Known dependency:** Arm B's task quality depends on live Gemini calls succeeding under concurrent Prolific traffic — needs a dedicated API key with real headroom, not the shared/rate-limited fallback key.

---

## Paper 2 — deferred, earns its place after Paper 1

Only pursued if Paper 1 shows representation moves the needle. Candidate questions, none committed to yet:

- **Handle vs. Complex Concept** — should a board support second-order concepts built from relationships among already-validated Handles (e.g., "municipal responsiveness" built from "service delay" + "response failure"), tested against whether the grouping explains the underlying observations *better* than the separate Handles do? Not currently part of the tool. A real addition, not a reframing — has to earn its place through its own evidence, not a design conversation.
- **Neighborhood-search repair vs. hard rejection** — instead of a terminal reject, search a bounded concept neighborhood (more abstract / more specific / lateral) for a representation the data does support, keeping the original as visible provenance rather than punishment. Flagged risk: unconstrained search against the same sample is a multiple-comparisons problem — repeated retries inflate the odds of a false positive the same way the original "search until something correlates" pattern did in the CTR/Travel-Destination and Titanic-ticket-group examples that motivated the Confound Check in the first place. Needs a bounded attempt count and visible retry-count-lowers-confidence discipline if built, and needs its own study — not bundled into Paper 1, so a positive or negative Paper 1 result isn't confounded with an unproven second mechanic.
- **Propose-then-check vs. compute-then-name ordering** — an open, evidence-based question from this project's own working sessions, not just theory: the freshest, most defensible findings produced this session (the Titanic third-class travel-party effect, the candy price residual) came from computing structure first and naming it second, not from free domain-knowledge brainstorming followed by a check. That's in tension with the tool's own documented step 1 ("propose from domain knowledge, not enumerated from raw columns"). Worth testing directly: does concept quality differ depending on whether the model sees computed structure before or after proposing a name?
- Grounding sufficiency, abstraction-level tuning, provenance tracking as its own research object (studying the *trajectory* of a representation across revisions, not just its final state).

---

## Paper 3 — the synthesis

**Framing (Porter):** Theodore Porter's *Trust in Numbers* doesn't ask "how do we make knowledge more rigorous" — it asks how communities create trust when trust can't depend on personal authority. Quantification rose fastest specifically where institutional trust was weakest: professions exposed to skeptical outsiders adopted mechanical objectivity as a substitute for the credibility that insider trust would otherwise provide.

**The contemporary version of the question:** in an AI-mediated world, where the analyst may be invisible, the reasoning process partially hidden, the user unable to evaluate the whole chain, and the output linguistic and persuasive by construction — what forms of accountability can substitute for interpersonal trust? The problem isn't just "bad reasoning." It's trust allocation.

**Where this project adds something Porter's world didn't have:** Porter's subjects produced knowledge for other *humans* to evaluate and trust — accountability was fundamentally interpersonal, even when mediated by numbers. This project's checks (grounding, Confound Check, Completeness Check) run *during generation*, before any human sees the output — a constraint on what the generator is permitted to claim, not only a trust signal for a skeptical reader after the fact. Porter's human bureaucrats couldn't hallucinate a fluent, confident, wrong answer the way a language model can. Accountability-as-self-discipline-on-a-system-that-could-otherwise-say-anything is the part of this that's genuinely new to the AI era, not an application of an existing idea.

**Paper 3's contribution:** design principles for evidence-grounded conceptual representations — grounding, confound-checking, completeness/residual-naming, and provenance — presented explicitly as *not* trying to imitate statistics, but as the discipline language-based analysis needs to be inspectable and revisable on its own terms.

---

## A terminology note

Use **"representation"** or **"language-based representation"** when writing for a research audience — it connects immediately to cognitive science, information science, HCI, and AI, where "concept" reads as philosophical and vague. The product itself keeps **"Handle"** and **"concept"** in its own UI — that's the right word for a Prolific participant or a first-time user, and there's no reason to rename the tool to suit a paper's audience. Two vocabularies, one idea, deliberately kept separate.
