"""Stage 6: the three visualizations (spec §16-18).

Not implemented yet — blocked on a real corpus (see results/data_profile.md).
Sketched interface only.

Intended behavior:
- corpus_map(embeddings_2d, metadata, seeds) -> writes results/corpus_map.html
    Interactive 2D map (one point per publication); hover shows title,
    author, year, ID; highlights seed publications; clicking a seed shows
    its nearest semantic neighbors if feasible. Exploratory only, not
    evidence by itself (spec §16).
- lexical_vs_semantic_panel(seed, lexical_results, semantic_results)
    Side-by-side comparison per interesting seed (spec §17), with results
    that appear in only one method highlighted.
- semantic_only_discoveries_table(candidate_cases)
    Seed -> semantic neighbor -> why lexical retrieval missed it -> why it
    may still be related. Any generated explanation must be labeled
    `machine_generated_hypothesis` and kept visually separate from
    `human_verdict` (spec §18-11).
"""
from __future__ import annotations

from typing import Any


def corpus_map(embeddings_2d: Any, metadata: Any, seeds: list[str], out_path: str) -> None:
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")


def lexical_vs_semantic_panel(seed: dict[str, Any], lexical_results: list[Any], semantic_results: list[Any]) -> str:
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")


def semantic_only_discoveries_table(candidate_cases: list[dict[str, Any]]) -> str:
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")
