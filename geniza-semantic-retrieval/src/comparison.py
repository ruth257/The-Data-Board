"""Stage 4: comparison table + intersection analysis + descriptive metrics
(spec §12-14).

Not implemented yet — blocked on a real corpus (see results/data_profile.md).
Sketched interface only.

Intended behavior:
- build_comparison_table(phase1_results) -> pd.DataFrame
    Writes results/retrieval_comparison.csv with exactly the columns listed
    in spec §12 (seed_id, seed_title, seed_year, method, rank, retrieved_id,
    retrieved_title, retrieved_year, similarity_score, lexical_overlap,
    shared_entities, shared_identifiers, language_seed, language_result,
    candidate_interesting_case, candidate_reason, human_verdict [blank],
    human_notes [blank]).
- intersection_analysis(phase1_results) -> pd.DataFrame
    Per seed: shared retrievals, lexical-only results, semantic-only
    results, rank displacement for records appearing in both lists.
- descriptive_metrics(phase1_results) -> dict
    Top-10 overlap, Jaccard similarity between retrieval sets, lexical
    overlap of semantic-only results, publication-year distribution,
    language distribution, duplicate rate. Explicitly does NOT invent an
    accuracy metric or a mean-reciprocal-rank without genuine ground truth
    (spec §14).
"""
from __future__ import annotations

from typing import Any


def build_comparison_table(phase1_results: list[dict[str, Any]]):
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")


def intersection_analysis(phase1_results: list[dict[str, Any]]):
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")


def descriptive_metrics(phase1_results: list[dict[str, Any]]) -> dict[str, Any]:
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")
