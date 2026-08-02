# The Data Board: AI Methodology & Framework

## Overview
The Data Board is an AI-first methodology for data analysis that uses human language to construct an audited narrative foundation. Created by **Ruth Aharon**, it shifts the AI's role from "Generative Invention" to "Semantic Verification."

## Core Principles (v4.0)

### 1. Paradigm Generator Mode (Verification Shift)
The AI is not the author; it is the auditor. It stops "guessing" meaning and starts "verifying" it against the evidence. This moves the AI from a generative task to a discriminative one, reducing hallucinations.

### 2. Concept-First, Then Grounded
Propose the way an analyst actually thinks — a hypothesis drawn from domain knowledge — then check it against the data. Every claim must cite specific values from the actual dataset when one is available; otherwise say "general domain knowledge, not data-verified" rather than inventing a plausible-sounding number.

### 3. Pseudo-Antonyms
Structural opposites — conditional, not mandatory. A pseudo-antonym only earns its place when a real, independently-grounded opposite survives the same check. Most concepts have no natural opposite; forcing one onto every concept is the failure mode this framework exists to catch, not the goal.

### 4. Calibrated Naming
Naming is the primary act of analysis, and it cuts both ways: climb to a synthesized name only when the literal term would flatten a real mechanism. Otherwise keep the literal term — jargon that explains nothing new is worse than the plain term it replaced.

### 5. Confound Check (Pearl-style)
Before crediting a pattern, ask what else visible in the data could explain it — the prerequisite step Pearl & Mackenzie's ladder of causation puts before any causal claim. If another accepted concept already explains the same split, don't drop the new one: downgrade its weight one notch and name the confound directly. Only drop a concept if the pattern actually disappears once you account for the confound. This is a narrow check that should touch a minority of concepts — it exists to catch the rare fully-explained-away pattern, not to thin the board.

## Evaluation Matrix
Concepts are audited based on:
- **Evidence Grounding**: cited against real data vs. general domain knowledge (`evidenceGrounded` flag).
- **Confound Resistance**: does the pattern survive conditioning on an obvious alternative variable already on the board?
- **Narrative Contribution**: does it belong to a Narrative Thread — a set of concepts that, together, carry one story?

## Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion.
- **Narrative Threads:** LLM-judgment clustering (not statistical/embedding-based) with drag-to-refine and per-thread re-audit — see `src/components/NarrativeThreads.tsx`.
- **Logic Syntax:** YAML (for the Logic Board Specification).

## For AI Agents
1. **Respect the Role**: You are a Paradigm Generator. Evaluate proposed vocabulary against the logic audit matrix.
2. **Logic as Code**: Treat the Logic Board YAML as the formal truth.
3. **Ground before naming**: check the concept against real data before promoting it, not after.
4. **Tensions are conditional**: look for Pseudo-Antonym pairs only where a real one exists — don't force it.
5. **Check confounds narrowly**: before crediting a pattern, check it against any obvious alternative already visible in the data — but downgrade, don't drop, unless the pattern truly disappears.
