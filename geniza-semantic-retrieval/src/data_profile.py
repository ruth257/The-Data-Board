"""Stage 0: inspect whatever is actually in data/ before any modeling code runs.

Per the project spec, this stage must never fabricate or download a
substitute corpus. If no real bibliographic file is present, it writes a
precise data-requirement report instead of a profile, and the caller
(run_experiment.py) stops the pipeline there.
"""
from __future__ import annotations

import json
import re
import unicodedata
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import pandas as pd
import yaml

CANDIDATE_SUFFIXES = {".csv", ".tsv", ".json", ".jsonl", ".bib"}
IGNORED_NAMES = {"README.md"}

EXPECTED_FIELDS = [
    "title",
    "authors",
    "publication_year",
    "venue",  # journal / book / proceedings
    "abstract",
    "keywords",
    "shelfmark",  # Genizah shelfmark / manuscript identifier
    "language",
    "references",
    "notes",
]


@dataclass
class DataProfileResult:
    found_corpus: bool
    source_path: str | None = None
    n_records: int = 0
    fields_present: list[str] = field(default_factory=list)
    fields_missing_from_expected: list[str] = field(default_factory=list)
    missingness: dict[str, float] = field(default_factory=dict)
    languages: dict[str, int] = field(default_factory=dict)
    year_range: tuple[int | None, int | None] = (None, None)
    n_exact_duplicates: int = 0
    n_near_duplicate_pairs: int | None = None  # None = not computed
    notes: list[str] = field(default_factory=list)


def _load_config(config_path: Path) -> dict[str, Any]:
    with open(config_path, "r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def find_candidate_corpus_files(data_dir: Path) -> list[Path]:
    """Look for real bibliographic exports under data/, ignoring the
    placeholder README and anything explicitly marked as demo/synthetic."""
    candidates = []
    for p in sorted(data_dir.rglob("*")):
        if not p.is_file():
            continue
        if p.name in IGNORED_NAMES:
            continue
        if "DEMO" in p.parts or "demo" in p.parts:
            continue
        if p.suffix.lower() in CANDIDATE_SUFFIXES:
            candidates.append(p)
    return candidates


def _load_records(path: Path) -> pd.DataFrame:
    suffix = path.suffix.lower()
    if suffix == ".csv":
        return pd.read_csv(path)
    if suffix == ".tsv":
        return pd.read_csv(path, sep="\t")
    if suffix == ".json":
        return pd.read_json(path)
    if suffix == ".jsonl":
        return pd.read_json(path, lines=True)
    if suffix == ".bib":
        raise NotImplementedError(
            "BibTeX parsing is not implemented yet — convert to CSV/JSON first, "
            "or extend _load_records with a .bib parser (e.g. via `bibtexparser`)."
        )
    raise ValueError(f"Unsupported file type: {path}")


_HEBREW_RE = re.compile(r"[֐-׿]")
_LATIN_RE = re.compile(r"[A-Za-z]")


def _guess_language(text: str) -> str:
    if not isinstance(text, str) or not text.strip():
        return "unknown"
    has_hebrew = bool(_HEBREW_RE.search(text))
    has_latin = bool(_LATIN_RE.search(text))
    if has_hebrew and has_latin:
        return "mixed_hebrew_latin"
    if has_hebrew:
        return "hebrew"
    if has_latin:
        return "latin_script"
    return "other"


def profile_corpus(df: pd.DataFrame, source_path: Path) -> DataProfileResult:
    fields_present = list(df.columns)
    fields_missing = [f for f in EXPECTED_FIELDS if f not in fields_present]

    missingness = {
        col: round(float(df[col].isna().mean() + (df[col] == "").mean() if df[col].dtype == object else df[col].isna().mean()), 4)
        for col in fields_present
    }

    lang_col = None
    for candidate in ("language", "lang"):
        if candidate in df.columns:
            lang_col = candidate
            break
    if lang_col is not None:
        languages = dict(Counter(df[lang_col].fillna("unknown").astype(str)))
    elif "title" in df.columns:
        languages = dict(Counter(df["title"].map(_guess_language)))
    else:
        languages = {}

    year_col = None
    for candidate in ("publication_year", "year"):
        if candidate in df.columns:
            year_col = candidate
            break
    year_range: tuple[int | None, int | None] = (None, None)
    if year_col is not None:
        years = pd.to_numeric(df[year_col], errors="coerce").dropna()
        if len(years):
            year_range = (int(years.min()), int(years.max()))

    n_exact_duplicates = int(df.duplicated().sum())

    notes = []
    if "title" not in fields_present:
        notes.append("No 'title' field found — Representation A/B both require it.")
    if not any(c in fields_present for c in ("shelfmark", "manuscript_id")):
        notes.append(
            "No manuscript/shelfmark identifier field found — 'shared identifiers' "
            "in the comparison table (spec §12) will be unavailable."
        )

    return DataProfileResult(
        found_corpus=True,
        source_path=str(source_path),
        n_records=len(df),
        fields_present=fields_present,
        fields_missing_from_expected=fields_missing,
        missingness=missingness,
        languages=languages,
        year_range=year_range,
        n_exact_duplicates=n_exact_duplicates,
        n_near_duplicate_pairs=None,
        notes=notes,
    )


def render_report(result: DataProfileResult) -> str:
    if not result.found_corpus:
        return _render_missing_data_report()

    lines = [
        "# Data Profile",
        "",
        f"**Source:** `{result.source_path}`",
        f"**Records:** {result.n_records}",
        "",
        "## Fields present",
        "",
        "\n".join(f"- `{f}`" for f in result.fields_present) or "(none)",
        "",
        "## Expected fields not found",
        "",
        ("\n".join(f"- `{f}`" for f in result.fields_missing_from_expected) or "(all expected fields present)"),
        "",
        "## Missingness (fraction of records with an empty/NaN value, by field)",
        "",
        "| field | missing fraction |",
        "|---|---|",
    ]
    for f, m in result.missingness.items():
        lines.append(f"| `{f}` | {m:.1%} |")
    lines += [
        "",
        "## Language distribution",
        "",
        "| language | count |",
        "|---|---|",
    ]
    for lang, count in sorted(result.languages.items(), key=lambda kv: -kv[1]):
        lines.append(f"| {lang} | {count} |")
    lines += [
        "",
        f"## Publication years: {result.year_range[0]} – {result.year_range[1]}",
        "",
        f"## Exact duplicate rows: {result.n_exact_duplicates}",
        "",
        "Near-duplicate detection (fuzzy title/author match) was not run in this "
        "pass — add it once a real corpus is loaded (see src/preprocess.py).",
        "",
        "## Notes",
        "",
        "\n".join(f"- {n}" for n in result.notes) or "- (none)",
    ]
    return "\n".join(lines)


def _render_missing_data_report() -> str:
    expected_fields_table = "\n".join(f"| `{f}` |" for f in EXPECTED_FIELDS)
    return f"""# Data Profile — STOPPED: no bibliographic corpus found

Per the project spec (\"First task: inspect the available data\"), this
pipeline does not proceed past data inspection without a real corpus, and
does **not** download or fabricate a substitute one.

## What was checked

`src/data_profile.py` scanned `data/` for files with extension
`.csv`, `.tsv`, `.json`, `.jsonl`, or `.bib` (excluding `data/README.md`
and anything under a `DEMO*` path). **No candidate file was found.**

## What is needed to proceed

A bibliographic export — most plausibly derived from the **Friedberg
Genizah Project (FGP)** bibliographic database (per FGP's own public
description, its research platform holds roughly 200,000 bibliographic
references keyed to Genizah shelfmarks, covering domain, title, author,
language, and script; see
[Friedberg Genizah Project — Research Platform](https://pr.genizah.org/TheResearchPlatform.aspx)
and the project's [Wikipedia entry](https://en.wikipedia.org/wiki/Friedberg_Geniza_Project)) —
or an equivalent bibliography (e.g. a Cambridge Genizah Research Unit
export, a Zotero/EndNote library assembled for this project, or a curated
CSV) placed at the path given by `config.yaml: data.input_path`
(default: `data/friedberg_bibliography.csv`).

### Minimum viable schema

One row per bibliographic record. The pipeline actively looks for the
following column names (case-sensitive; adjust `src/data_profile.py` if
the real export uses different names):

| expected column |
|---|
{expected_fields_table}

At minimum, `title` must be present for Representation A (title-only) to
be constructible at all; `authors`, `venue`, `publication_year`,
`keywords`, `abstract`, and `notes` are needed for Representation B
(bibliographic text) per spec §6. A `shelfmark`/manuscript-identifier
column is needed to compute "shared identifiers" in the retrieval
comparison table (spec §12) and is one of the more distinctive signals
this pilot can use, since it is specific to Genizah scholarship rather
than generic bibliographic metadata.

### Scale

The pilot is designed for **100–500 records** (spec §5) — not the full
~200,000-reference FGP database. A representative, topically diverse
subset is preferable to an arbitrary prefix of the data.

### Format

CSV, TSV, JSON, or JSON-Lines are all supported by `_load_records()` in
`src/data_profile.py`. BibTeX (`.bib`) files are detected but not yet
parsed — convert to one of the above formats first, or extend
`_load_records()` with a BibTeX parser (e.g. `bibtexparser`).

## Next step

Place a real export at `data/` (see `data/README.md`), update
`config.yaml: data.input_path` if the filename differs, and re-run:

```bash
python -m src.data_profile
```

This will regenerate this file as an actual profile (record count, field
inventory, missingness, language distribution, publication-year range,
duplicate count) instead of this requirement report. Only once that
profile looks reasonable should `run_experiment.py` be allowed to proceed
past Stage 0.
"""


def run(config_path: str = "config.yaml", project_root: str | None = None) -> DataProfileResult:
    root = Path(project_root) if project_root else Path(__file__).resolve().parent.parent
    config = _load_config(root / config_path)
    data_dir = root / "data"
    results_dir = root / config["output"]["results_dir"]
    results_dir.mkdir(parents=True, exist_ok=True)

    candidates = find_candidate_corpus_files(data_dir)

    if not candidates:
        result = DataProfileResult(found_corpus=False)
    else:
        # Prefer the file named in config if present among candidates.
        configured = root / config["data"]["input_path"]
        source = configured if configured in candidates else candidates[0]
        df = _load_records(source)
        result = profile_corpus(df, source)

    report = render_report(result)
    out_path = results_dir / "data_profile.md"
    out_path.write_text(report, encoding="utf-8")
    return result


if __name__ == "__main__":
    result = run()
    if result.found_corpus:
        print(f"Profiled {result.n_records} records from {result.source_path}.")
    else:
        print(
            "No bibliographic corpus found under data/. "
            "Wrote a data-requirement report to results/data_profile.md and stopped, "
            "per the project's data-discipline rule (no fabricated/downloaded substitute data)."
        )
