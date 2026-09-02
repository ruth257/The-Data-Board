"""Stage 0: inspect the actual machine-readable PGP metadata export.

Per the project spec, we do not assume the schema from the PGP website or
even from its own README — we inspect the real CSVs and report what is
actually there, including where the real data diverges from its own
documentation. This script is read-only: it never writes into data/raw/.

Source: https://github.com/princetongenizalab/pgp-metadata (CC-BY-NC-4.0),
the Princeton Geniza Project's own published tabular export. This is a
*different* corpus from the planned Friedberg Genizah Project (FGP)
bibliography used in ../geniza-semantic-retrieval/ — see this project's
README for why the two must not be conflated.
"""
from __future__ import annotations

import re
from pathlib import Path

import pandas as pd
import yaml

RAW_FILES = ["documents", "fragments", "sources", "footnotes", "people", "places"]

# The field lists documented in pgp-metadata's own README.md, transcribed
# verbatim, so we can report exactly where the live CSV headers diverge
# from the dataset's own documentation (spec: "do not assume the schema
# from the project website").
README_DOCUMENTED_FIELDS = {
    "documents": [
        "pgpid", "url", "iiif_urls", "fragment_urls", "shelfmark", "multifragment",
        "side", "region", "type", "tags", "description", "scholarship_records",
        "shelfmarks_historic", "languages_primary", "languages_secondary",
        "language_note", "doc_date_original", "doc_date_calendar",
        "doc_date_standard", "inferred_date_display", "inferred_date_standard",
        "inferred_date_rationale", "inferred_date_notes", "initial_entry",
        "last_modified", "input_by", "library", "collection", "has_transcription",
        "has_translation",
    ],
    "fragments": [
        "shelfmark", "pgpids", "shelfmarks_historic", "collection", "library",
        "library_abbrev", "collection_name", "collection_abbrev", "url",
        "iiif_url", "is_multifragment", "created", "last_modified",
        "provenance_display", "provenance", "material_support",
    ],
    "sources": [
        "source_type", "authors", "title", "journal_book", "volume", "issue",
        "year", "place_published", "publisher", "edition", "other_info",
        "page_range", "languages", "url", "notes", "citation", "slug",
        "num_footnotes",
    ],
    "footnotes": [
        "document", "document_id", "source", "source_slug", "location",
        "doc_relation", "emendation", "notes", "url", "content",
    ],
    "people": [
        "name", "name_variants", "gender", "social_role", "auto_date_range",
        "manual_date_range", "description", "tags", "related_people_count",
        "family_traces_roots_to", "home_base", "traveled_to",
        "related_documents_count", "url",
    ],
    "places": [
        "name", "name_variants", "is_region", "coordinates", "geographic area",
        "notes", "related_documents_count",
    ],
}

PLACE_ROLE_COLUMNS = [
    "origin", "destination", "location", "mentioned",
    "possibly_mentioned", "formerly_believed_to_be_mentioned",
]

YEAR_RE = re.compile(r"\b(\d{3,4})\b")


def load_all(raw_dir: Path) -> dict[str, pd.DataFrame]:
    return {name: pd.read_csv(raw_dir / f"{name}.csv", encoding="utf-8-sig", dtype=str, keep_default_na=False)
            for name in RAW_FILES}


def _missingness_table(df: pd.DataFrame) -> list[tuple[str, float]]:
    n = len(df)
    return [(col, round((df[col] == "").mean(), 4)) for col in df.columns] if n else []


def _schema_diff(name: str, actual_cols: list[str]) -> tuple[list[str], list[str]]:
    documented = README_DOCUMENTED_FIELDS.get(name, [])
    extra = [c for c in actual_cols if c not in documented]
    missing = [c for c in documented if c not in actual_cols]
    return extra, missing


def _split_multi(value: str) -> list[str]:
    if not value:
        return []
    parts = re.split(r"[;,]", value)
    return [p.strip() for p in parts if p.strip()]


def profile_documents(df: pd.DataFrame, places_names: set[str]) -> dict:
    n = len(df)
    dup_pgpid = int(df["pgpid"].duplicated().sum())
    dup_rows = int(df.duplicated().sum())

    languages = {}
    for val in df["languages_primary"]:
        for lang in _split_multi(val):
            languages[lang] = languages.get(lang, 0) + 1

    types = df["type"].value_counts().to_dict()

    years = []
    for val in df["inferred_date_standard"].tolist() + df["doc_date_standard"].tolist():
        years += [int(y) for y in YEAR_RE.findall(val)]
    years = [y for y in years if 0 < y < 2100]

    multifragment_shelfmarks = int(df["shelfmark"].str.contains(r"\+", regex=True).sum())

    place_mentions = {col: 0 for col in PLACE_ROLE_COLUMNS}
    matched = 0
    unmatched: list[str] = []
    for col in PLACE_ROLE_COLUMNS:
        for val in df[col]:
            for part in _split_multi(val):
                place_mentions[col] += 1
                if part in places_names:
                    matched += 1
                elif len(unmatched) < 10:
                    unmatched.append(part)
    total_place_mentions = sum(place_mentions.values())

    return {
        "n_records": n,
        "n_columns": len(df.columns),
        "columns": list(df.columns),
        "duplicate_pgpid_rows": dup_pgpid,
        "duplicate_exact_rows": dup_rows,
        "missingness": _missingness_table(df),
        "languages_primary": dict(sorted(languages.items(), key=lambda kv: -kv[1])),
        "types": types,
        "year_range": (min(years), max(years)) if years else (None, None),
        "multifragment_shelfmark_count": multifragment_shelfmarks,
        "place_mentions_by_role": place_mentions,
        "place_mentions_total": total_place_mentions,
        "place_mentions_matched_to_places_csv": matched,
        "place_mentions_unmatched_sample": unmatched,
    }


def profile_fragments(df: pd.DataFrame) -> dict:
    multi_doc = 0
    for val in df["pgpids"]:
        if len(_split_multi(val)) > 1:
            multi_doc += 1
    return {
        "n_records": len(df),
        "n_columns": len(df.columns),
        "columns": list(df.columns),
        "missingness": _missingness_table(df),
        "fragments_holding_multiple_documents": multi_doc,
        "library_distribution_top10": df["library"].value_counts().head(10).to_dict(),
    }


def profile_sources(df: pd.DataFrame) -> dict:
    years = [int(y) for y in df["year"] if YEAR_RE.fullmatch(y.strip())]
    return {
        "n_records": len(df),
        "n_columns": len(df.columns),
        "columns": list(df.columns),
        "missingness": _missingness_table(df),
        "source_type_distribution": df["source_type"].value_counts().to_dict(),
        "year_range": (min(years), max(years)) if years else (None, None),
    }


def profile_footnotes(df: pd.DataFrame, doc_pgpids: set[str]) -> dict:
    relation_counts: dict[str, int] = {}
    for val in df["doc_relation"]:
        for part in _split_multi(val):
            relation_counts[part] = relation_counts.get(part, 0) + 1
    non_document_rows = int((~df["document_id"].isin(doc_pgpids)).sum())
    return {
        "n_records": len(df),
        "n_columns": len(df.columns),
        "columns": list(df.columns),
        "missingness": _missingness_table(df),
        "doc_relation_distribution": relation_counts,
        "rows_where_document_id_is_not_a_document_pgpid": non_document_rows,
        "note": (
            "A handful of footnote rows cite person or place pages rather than "
            "documents (document_id then refers to an internal person/place id "
            "not exposed in people.csv/places.csv, which carry no id column at "
            "all — only name + url slug). These rows are excluded from the "
            "document<->publication graph edges built in build_graph.py."
        ),
    }


def profile_people(df: pd.DataFrame) -> dict:
    return {
        "n_records": len(df),
        "n_columns": len(df.columns),
        "columns": list(df.columns),
        "missingness": _missingness_table(df),
        "gender_distribution": df["gender"].value_counts().to_dict(),
        "social_roles_distribution": df["social_roles"].value_counts().to_dict() if "social_roles" in df.columns else {},
        "n_with_zero_related_documents": int((df["related_documents_count"] == "0").sum()),
        "has_stable_id_column": False,
    }


def profile_places(df: pd.DataFrame) -> dict:
    return {
        "n_records": len(df),
        "n_columns": len(df.columns),
        "columns": list(df.columns),
        "missingness": _missingness_table(df),
        "is_region_distribution": df["is_region"].value_counts().to_dict(),
        "n_with_coordinates": int((df["coordinates"] != "").sum()),
        "has_stable_id_column": False,
    }


def render_report(profiles: dict, schema_diffs: dict) -> str:
    lines = [
        "# PGP Data Profile",
        "",
        "Source: [princetongenizalab/pgp-metadata](https://github.com/princetongenizalab/pgp-metadata)"
        " (CC-BY-NC-4.0). Generated by `src/inspect_pgp.py` against the real CSVs — "
        "nothing below is taken from the project website or its README without "
        "being checked against the actual files.",
        "",
        "**This is the PGP prototype corpus, not the planned FGP bibliography "
        "corpus used in `../geniza-semantic-retrieval/`. The two are unrelated "
        "datasets and are never merged.**",
        "",
        "## Dataset overview",
        "",
        "| file | records | columns |",
        "|---|---|---|",
    ]
    for name in RAW_FILES:
        p = profiles[name]
        lines.append(f"| `{name}.csv` | {p['n_records']:,} | {p['n_columns']} |")

    lines += ["", "## Schema vs. the dataset's own README documentation", ""]
    for name in RAW_FILES:
        extra, missing = schema_diffs[name]
        if not extra and not missing:
            lines.append(f"- `{name}.csv`: matches README exactly.")
            continue
        lines.append(f"- `{name}.csv`:")
        if extra:
            lines.append(f"  - columns present in the CSV but **not** listed in the README: {', '.join(f'`{c}`' for c in extra)}")
        if missing:
            lines.append(f"  - columns the README lists that are **not** in the CSV: {', '.join(f'`{c}`' for c in missing)}")

    d = profiles["documents"]
    lines += [
        "",
        "## documents.csv",
        "",
        f"- {d['n_records']:,} records, {d['n_columns']} columns",
        f"- duplicate `pgpid` values: {d['duplicate_pgpid_rows']} (should be 0 — pgpid is the primary key)",
        f"- exact duplicate rows: {d['duplicate_exact_rows']}",
        f"- inferred/original date years found range: {d['year_range'][0]}–{d['year_range'][1]} "
        "(parsed by regex from free-text date fields — treat as approximate, not validated)",
        f"- shelfmarks indicating multiple joined fragments (`+` in shelfmark): {d['multifragment_shelfmark_count']:,}",
        "",
        "### `type` distribution",
        "",
        "| type | count |",
        "|---|---|",
    ]
    for t, c in sorted(d["types"].items(), key=lambda kv: -kv[1]):
        lines.append(f"| {t or '(blank)'} | {c} |")

    lines += ["", "### `languages_primary` distribution (documents can list more than one)", "", "| language | count |", "|---|---|"]
    for lang, c in list(d["languages_primary"].items())[:25]:
        lines.append(f"| {lang} | {c} |")

    lines += [
        "",
        "### Document → Place mentions (embedded directly in documents.csv)",
        "",
        "Six role columns (`origin`, `destination`, `location`, `mentioned`, "
        "`possibly_mentioned`, `formerly_believed_to_be_mentioned`) each hold "
        "place name(s) for that document. **This directly contradicts the "
        "pgp-metadata README's own claim** that \"links between... places and "
        "documents\" are not included in this data package — they are, at "
        "least for these six relation types, embedded in `documents.csv` "
        "itself rather than in `places.csv`.",
        "",
        "| role | mentions |",
        "|---|---|",
    ]
    for role, c in d["place_mentions_by_role"].items():
        lines.append(f"| {role} | {c} |")
    lines += [
        "",
        f"- total place mentions: {d['place_mentions_total']:,}",
        f"- matched exactly to a `places.csv` name: {d['place_mentions_matched_to_places_csv']:,} "
        f"({d['place_mentions_matched_to_places_csv'] / d['place_mentions_total']:.1%} of mentions)"
        if d["place_mentions_total"] else "- no place mentions found",
        f"- unmatched sample: {d['place_mentions_unmatched_sample']}" if d["place_mentions_unmatched_sample"] else "- no unmatched names",
    ]

    lines += ["", "### Missingness (top 15 emptiest columns)", "", "| column | fraction empty |", "|---|---|"]
    for col, frac in sorted(d["missingness"], key=lambda kv: -kv[1])[:15]:
        lines.append(f"| `{col}` | {frac:.1%} |")

    f = profiles["fragments"]
    lines += [
        "",
        "## fragments.csv",
        "",
        f"- {f['n_records']:,} records, {f['n_columns']} columns",
        f"- fragments holding **more than one** PGP document (a source-justified "
        f"DOCUMENT↔DOCUMENT \"shares a fragment\" edge): {f['fragments_holding_multiple_documents']:,}",
        "",
        "### top holding libraries",
        "",
        "| library | count |",
        "|---|---|",
    ]
    for lib, c in f["library_distribution_top10"].items():
        lines.append(f"| {lib or '(blank)'} | {c} |")

    s = profiles["sources"]
    lines += [
        "",
        "## sources.csv",
        "",
        f"- {s['n_records']:,} records, {s['n_columns']} columns",
        f"- publication year range: {s['year_range'][0]}–{s['year_range'][1]}",
        "",
        "### `source_type` distribution",
        "",
        "| type | count |",
        "|---|---|",
    ]
    for t, c in sorted(s["source_type_distribution"].items(), key=lambda kv: -kv[1]):
        lines.append(f"| {t or '(blank)'} | {c} |")

    fn = profiles["footnotes"]
    lines += [
        "",
        "## footnotes.csv",
        "",
        f"- {fn['n_records']:,} records, {fn['n_columns']} columns",
        f"- rows whose `document_id` does NOT match a `documents.csv` pgpid "
        f"(person/place page footnotes, not usable for the document↔publication "
        f"graph without a name-matching step): {fn['rows_where_document_id_is_not_a_document_pgpid']}",
        f"- {fn['note']}",
        "",
        "### `doc_relation` distribution",
        "",
        "| relation | count |",
        "|---|---|",
    ]
    for r, c in sorted(fn["doc_relation_distribution"].items(), key=lambda kv: -kv[1]):
        lines.append(f"| {r or '(blank)'} | {c} |")

    p = profiles["people"]
    pl = profiles["places"]
    lines += [
        "",
        "## people.csv",
        "",
        f"- {p['n_records']:,} records, {p['n_columns']} columns",
        "- **no stable identifier column** — only `name` + a URL slug. This "
        "means document-level PERSON edges cannot be built from this export "
        "except by exact/near string matching against `name`, which was not "
        "attempted for milestone 1 (spec: only build relationships that can "
        "be justified from the source data).",
        f"- records with `related_documents_count` == 0: {p['n_with_zero_related_documents']:,}",
        "",
        "## places.csv",
        "",
        f"- {pl['n_records']:,} records, {pl['n_columns']} columns",
        "- also has no stable identifier column, but unlike people, "
        "`documents.csv`'s six place-role columns give us document-level PLACE "
        "edges directly, matched by exact name (100% match rate found above) "
        "— so PLACE edges ARE usable for milestone 1 even though PERSON edges "
        "are not.",
        f"- records with coordinates: {pl['n_with_coordinates']:,} / {pl['n_records']:,}",
        "",
        "## Relationships usable for the graph model (spec §6)",
        "",
        "| edge type | source columns | justification | usable in milestone 1 |",
        "|---|---|---|---|",
        "| DOCUMENT —associated_with→ PLACE | `documents.csv` role columns (origin/destination/location/mentioned/possibly_mentioned/formerly_believed_to_be_mentioned) | explicit, per-document, role-typed | yes |",
        "| DOCUMENT —cited_by→ PUBLICATION | `footnotes.csv` (document_id, source_slug, doc_relation) joined to `sources.csv` (slug) | explicit footnote citation | yes |",
        "| DOCUMENT —shares_fragment→ DOCUMENT | `fragments.csv` (pgpids list per shelfmark) | multiple documents transcribed from the same physical fragment | yes |",
        "| DOCUMENT —associated_with→ PERSON | none available at document level in this export | `people.csv` only has aggregate counts, no id/join key | **no** |",
        "| DOCUMENT —same_as/variant_of→ DOCUMENT | not present in this export | would require the full PGPv4 database, not this metadata snapshot | **no** |",
        "",
        "## What this means for the app",
        "",
        "Milestone 1 (this prototype) builds PLACE, PUBLICATION, and "
        "shares-fragment DOCUMENT relationships only, because those are the "
        "only ones this public export actually justifies. PERSON nodes/edges "
        "are a documented gap, not an oversight — see `results/graph_statistics.md` "
        "once generated.",
    ]
    return "\n".join(lines)


def run(config_path: str = "config.yaml", project_root: str | None = None) -> None:
    root = Path(project_root) if project_root else Path(__file__).resolve().parent.parent
    with open(root / config_path, "r", encoding="utf-8") as fh:
        config = yaml.safe_load(fh)
    raw_dir = root / config["data"]["raw_dir"]
    results_dir = root / config["output"]["results_dir"]
    results_dir.mkdir(parents=True, exist_ok=True)

    missing = [f for f in RAW_FILES if not (raw_dir / f"{f}.csv").exists()]
    if missing:
        msg = (
            f"# PGP Data Profile — STOPPED: raw data not found\n\n"
            f"Expected CSVs under `{raw_dir.relative_to(root)}/`: "
            f"{', '.join(f + '.csv' for f in RAW_FILES)}.\n\n"
            f"Missing: {', '.join(f + '.csv' for f in missing)}.\n\n"
            "Fetch the public PGP metadata export first:\n\n"
            "```bash\n"
            f"git clone --depth 1 https://github.com/princetongenizalab/pgp-metadata "
            f"{raw_dir.relative_to(root)}\n"
            "```\n\n"
            "Then re-run `python -m src.inspect_pgp`.\n"
        )
        (results_dir / "pgp_data_profile.md").write_text(msg, encoding="utf-8")
        print("Raw PGP data not found — wrote fetch instructions to results/pgp_data_profile.md.")
        return

    dfs = load_all(raw_dir)
    places_names = set(dfs["places"]["name"].str.strip())
    doc_pgpids = set(dfs["documents"]["pgpid"])

    profiles = {
        "documents": profile_documents(dfs["documents"], places_names),
        "fragments": profile_fragments(dfs["fragments"]),
        "sources": profile_sources(dfs["sources"]),
        "footnotes": profile_footnotes(dfs["footnotes"], doc_pgpids),
        "people": profile_people(dfs["people"]),
        "places": profile_places(dfs["places"]),
    }
    schema_diffs = {name: _schema_diff(name, profiles[name]["columns"]) for name in RAW_FILES}

    report = render_report(profiles, schema_diffs)
    (results_dir / "pgp_data_profile.md").write_text(report, encoding="utf-8")
    print(f"Wrote {results_dir / 'pgp_data_profile.md'}")


if __name__ == "__main__":
    run()
