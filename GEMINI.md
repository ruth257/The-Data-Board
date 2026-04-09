# The Data Board: AI Methodology & Framework

## Overview
The Data Board is an AI-first methodology for data analysis that uses human language to construct a **Deducible Space**. Created by **Ruth Aharon**, it shifts the AI's role from "Generative Invention" to "Semantic Verification."

## Core Principles

### 1. The Power of Synthesis (Semantic Synthesis)
Named concepts carry more meaning than their parts. In this framework, "naming" is the primary analytical act. A successful **Semantic Synthesis** finds the "Goldilocks" word: precise enough to reduce statistical guessing but flexible enough to enable human narration and discovery. By synthesizing raw data into these high-level "handles" (e.g., "Hegemonic Benchmark"), we create a type that can be reasoned about and built upon.

### 2. Analytical Stability (Shared Vocabulary)
LLMs are non-deterministic. Providing a pre-defined vocabulary anchors the model's latent space, reducing semantic noise and ensuring consistent, reproducible outputs across different runs.

### 3. The Verification Shift
When a concept is pre-supplied, the model stops "guessing" meaning and starts "checking" it. This moves the AI from a generative task to a discriminative one (Natural Language Inference), which significantly improves accuracy and reduces hallucinations.

## Key Components

### Pseudo-Antonyms©
A proprietary conceptual framework for defining the boundaries of a deducible space. It involves identifying the "tension pairs" that drive a narrative (e.g., "Chivalry" vs. "Class" in the Titanic dataset).

### The Deducible Space
The semantic "map" where narrative conclusions follow inevitably from the grounded concepts. If the vocabulary is correctly defined, the "Global Story" becomes a structural outcome rather than a statistical guess.

## Technical Implementation
- **Frontend:** React, Tailwind CSS, Framer Motion.
- **Visualization:** D3.js for the Relationship Graph (Semantic Map).
- **AI Integration:** Google Gemini SDK (@google/genai).
- **Data Handling:** CSV/JSON parsing for raw evidence.

## For AI Agents
When interacting with this codebase or methodology:
1. **Respect the Vocabulary:** Do not invent new terms if a board already exists. Use the existing "handles" to explain patterns.
2. **Focus on Tension:** Look for the "tug-of-war" between concepts.
3. **Audit the Logic:** Always check if the "Global Story" is actually supported by the "Data Insights" attached to each tile.
