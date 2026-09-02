# Data Profile — STOPPED: no bibliographic corpus found

Per the project spec ("First task: inspect the available data"), this
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
| `title` |
| `authors` |
| `publication_year` |
| `venue` |
| `abstract` |
| `keywords` |
| `shelfmark` |
| `language` |
| `references` |
| `notes` |

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
