"""Stage 2b: semantic embeddings for the same canonical documents (spec §8).

Not implemented yet — blocked on a real corpus (see results/data_profile.md).
Sketched interface only.

Intended behavior:
- load_model(model_name, model_version) -> model
    Must be a multilingual model capable of representing Hebrew and English
    reasonably well; the exact model/version is recorded in config.yaml and
    must be echoed into results/report.md (name, version, dimensionality,
    normalization procedure — spec §8).
- embed(documents, model, normalize) -> np.ndarray
- nearest_neighbors(query_id, embedding_matrix, doc_ids, top_k, exclude_ids)
    Cosine similarity, same candidate corpus as the lexical baseline.
"""
from __future__ import annotations

from typing import Any


def load_model(model_name: str, model_version: str | None):
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")


def embed(documents: list[str], model: Any, normalize: bool = True):
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")


def nearest_neighbors(
    query_id: str,
    embedding_matrix: Any,
    doc_ids: list[str],
    top_k: int = 10,
) -> list[tuple[str, float]]:
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")
