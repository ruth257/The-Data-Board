"""Stage 2a: lexical retrieval baseline (spec §7).

Not implemented yet — blocked on a real corpus (see results/data_profile.md).
Sketched interface only.

Intended behavior:
- fit_tfidf(documents, ngram_range, min_df) -> (vectorizer, matrix)
- fit_bm25(documents, k1, b) -> bm25_index
- nearest_neighbors(query_id, matrix_or_index, top_k, exclude_ids) -> list[(doc_id, score)]
    Given exactly the seed publication and the same candidate corpus used by
    the semantic stage, return the top_k lexical neighbors, excluding the
    seed itself.
"""
from __future__ import annotations

from typing import Any


def fit_tfidf(documents: list[str], ngram_range: tuple[int, int], min_df: int) -> Any:
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")


def fit_bm25(documents: list[str], k1: float, b: float) -> Any:
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")


def nearest_neighbors(
    query_id: str,
    index: Any,
    doc_ids: list[str],
    top_k: int = 10,
) -> list[tuple[str, float]]:
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")
