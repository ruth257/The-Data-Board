"""Stage 1: select a reproducible document subset and clean its fields.

Spec section 5: start with 1,000-5,000 documents, not the whole ~36k-record
corpus, chosen reproducibly via one of three modes. This module only
selects and cleans *documents* — relationship-building (which needs the
full fragments/footnotes/places tables to resolve edges correctly, even
for entities outside the sample) happens in build_graph.py.
"""
from __future__ import annotations

import csv
import re
from pathlib import Path

import pandas as pd
import yaml

PLACE_ROLE_COLUMNS = [
    "origin", "destination", "location", "mentioned",
    "possibly_mentioned", "formerly_believed_to_be_mentioned",
]


def _split_multi(value: str) -> list[str]:
    if not value:
        return []
    return [p.strip() for p in re.split(r"[;,]", value) if p.strip()]


def select_by_random(df: pd.DataFrame, n: int, seed: int) -> pd.DataFrame:
    n = min(n, len(df))
    return df.sample(n=n, random_state=seed).sort_values("pgpid")


def select_by_type(df: pd.DataFrame, n: int, seed: int) -> pd.DataFrame:
    """Even-ish sample across documents.csv's `type` categories, for
    topical diversity (spec §5 Mode B)."""
    types = df["type"].fillna("").replace("", "(untyped)")
    groups = df.groupby(types)
    n_groups = len(groups)
    per_group = max(1, n // n_groups)
    parts = []
    for _, g in groups:
        k = min(per_group, len(g))
        parts.append(g.sample(n=k, random_state=seed))
    out = pd.concat(parts)
    if len(out) > n:
        out = out.sample(n=n, random_state=seed)
    return out.sort_values("pgpid")


def select_by_manual_ids(df: pd.DataFrame, ids_path: Path) -> pd.DataFrame:
    if not ids_path.exists():
        raise FileNotFoundError(
            f"sample.mode is 'manual_ids' but {ids_path} does not exist. "
            "Create it with one PGPID per line (optionally a 'pgpid' CSV header)."
        )
    with open(ids_path, "r", encoding="utf-8") as fh:
        reader = csv.reader(fh)
        rows = [r[0].strip() for r in reader if r and r[0].strip()]
    ids = {r for r in rows if r.lower() != "pgpid"}
    return df[df["pgpid"].isin(ids)].sort_values("pgpid")


def clean_document(row: pd.Series) -> dict:
    place_mentions = []
    for role in PLACE_ROLE_COLUMNS:
        for name in _split_multi(row.get(role, "")):
            place_mentions.append({"role": role, "place_name": name})
    return {
        "id": row["pgpid"],
        "url": row.get("url", ""),
        "shelfmark": row.get("shelfmark", ""),
        # Named doc_type (not "type") to avoid colliding with the node-kind
        # discriminator ("document"/"place"/"publication") the app uses.
        "doc_type": row.get("type", "") or None,
        "description": row.get("description", ""),
        "languages": _split_multi(row.get("languages_primary", "")),
        "date_display": row.get("inferred_date_display") or row.get("doc_date_standard") or None,
        "library": row.get("library", "") or None,
        "collection": row.get("collection", "") or None,
        "has_transcription": row.get("has_transcription", "") == "Y",
        "has_translation": row.get("has_translation", "") == "Y",
        "tags": _split_multi(row.get("tags", "")),
        "place_mentions": place_mentions,
    }


def run(config_path: str = "config.yaml", project_root: str | None = None) -> list[dict]:
    root = Path(project_root) if project_root else Path(__file__).resolve().parent.parent
    with open(root / config_path, "r", encoding="utf-8") as fh:
        config = yaml.safe_load(fh)

    raw_dir = root / config["data"]["raw_dir"]
    processed_dir = root / config["data"]["processed_dir"]
    processed_dir.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(raw_dir / "documents.csv", encoding="utf-8-sig", dtype=str, keep_default_na=False)

    mode = config["sample"]["mode"]
    n = config["sample"]["n_documents"]
    seed = config["sample"]["random_seed"]

    if mode == "random":
        subset = select_by_random(df, n, seed)
    elif mode == "by_type":
        subset = select_by_type(df, n, seed)
    elif mode == "manual_ids":
        subset = select_by_manual_ids(df, root / config["sample"]["manual_ids_path"])
    else:
        raise ValueError(f"Unknown sample.mode: {mode!r}")

    documents = [clean_document(row) for _, row in subset.iterrows()]

    import json
    out_path = processed_dir / "documents.json"
    out_path.write_text(json.dumps(documents, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Selected {len(documents)} documents (mode={mode}) -> {out_path}")
    return documents


if __name__ == "__main__":
    run()
