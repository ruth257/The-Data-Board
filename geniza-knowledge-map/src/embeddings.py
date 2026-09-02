"""Stage 4 (milestone 2, spec §13, optional): semantic similarity layer.

Not implemented — the explicit relational graph (build_graph.py) has not
yet been evaluated for whether it produces useful exploratory behavior.
Per spec §2/§23, semantic edges are only worth adding after that
evaluation, and must be visually and label-distinguishable from
source-established edges (dashed line, "computationally similar", never
"related") — see data_dictionary.md.
"""
from __future__ import annotations


def embed_documents(documents: list[dict], model_name: str):
    raise NotImplementedError(
        "Milestone 2 — only build this after the explicit graph (milestone 1) "
        "has been used and judged worth extending."
    )
