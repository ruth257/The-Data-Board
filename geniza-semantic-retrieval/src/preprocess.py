"""Stage 1: build the canonical textual representation for each record.

Not implemented yet — this pipeline stops after src/data_profile.py until a
real corpus exists (see results/data_profile.md). This module's interface is
sketched now so the shape of the pipeline is visible, but every function
raises NotImplementedError rather than operating on placeholder data.

Intended behavior (spec §6-7):
- build_document(record, mode) -> str
    mode="title_only"        -> Representation A: just the title.
    mode="bibliographic_text" -> Representation B: title + authors + venue +
                                  year + keywords + abstract + notes, using
                                  only fields that actually exist in the
                                  loaded corpus. Never includes a pre-assigned
                                  subject/topic category (config: excluded_fields).
- preprocess_text(text, language) -> str
    Conservative only: optional lowercasing. No stemming, no translation, no
    rewriting, unless config.preprocessing explicitly turns it on — and any
    such setting must be applied per-language and reported in the report,
    per spec §7.
"""
from __future__ import annotations

from typing import Any


def build_document(record: dict[str, Any], mode: str, fields: dict[str, list[str]]) -> str:
    raise NotImplementedError(
        "Waiting on a real corpus (see results/data_profile.md) before "
        "implementing document construction."
    )


def preprocess_text(text: str, language: str, config: dict[str, Any]) -> str:
    raise NotImplementedError(
        "Waiting on a real corpus (see results/data_profile.md) before "
        "implementing preprocessing."
    )
