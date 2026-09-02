"""Stage 5 (optional, spec §15): embedding-space neighborhoods.

Only meant to run after retrieval works and is judged informative — see
config.yaml: clustering.enabled (defaults to false). Not implemented yet —
blocked on a real corpus (see results/data_profile.md).

Intended behavior:
- reduce_dimensions(embedding_matrix, method, n_components) -> np.ndarray
    "umap" preferred for exploratory visualization if available, else "pca".
- label_neighborhoods(...) -> ...
    Any grouping produced here must be labeled "embedding-space
    neighborhoods", never "true topics" (spec §15) — this module must not
    present clusters as an objective scholarly classification.
"""
from __future__ import annotations

from typing import Any


def reduce_dimensions(embedding_matrix: Any, method: str = "umap", n_components: int = 2):
    raise NotImplementedError("Waiting on a real corpus (see results/data_profile.md).")
