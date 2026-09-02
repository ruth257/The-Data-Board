"""Stage 3: the discovery phase (spec §9-10).

Not implemented yet — blocked on a real corpus (see results/data_profile.md).
Sketched interface only.

Intended behavior:
- select_seeds(doc_ids, n, random_seed) -> list[doc_id]
    Reproducible random sample of 30-50 seed publications (Phase 1).
- run_phase1(seeds, lexical_index, semantic_index, top_k) -> list[SeedResult]
    For every seed: remove it from the candidate set, retrieve top-k lexical
    and top-k semantic neighbors, store both. No hand-picking.
- flag_candidate_cases(phase1_results) -> list[CandidateCase]
    Heuristic surfacing of ~3-10 potentially interesting seeds (Phase 2) per
    the five illustrative patterns in spec §10 (terminology mismatch,
    conceptual relationship, multilingual relationship, fragment-centered
    relationship, lexical false positive). This produces
    `candidate_interesting_case = True` plus supporting evidence — it must
    never assert that a connection IS meaningful; `human_verdict` stays
    blank for a person to fill in (spec §11).
"""
from __future__ import annotations

from typing import Any


def select_seeds(doc_ids: list[str], n: int, random_seed: int) -> list[str]:
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")


def run_phase1(
    seeds: list[str],
    lexical_index: Any,
    semantic_index: Any,
    top_k: int = 10,
) -> list[dict[str, Any]]:
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")


def flag_candidate_cases(phase1_results: list[dict[str, Any]]) -> list[dict[str, Any]]:
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")
