# Data Dictionary — Geniza Knowledge Map

Every field shown anywhere in the web app traces back to one exact column
in the raw PGP export (`princetongenizalab/pgp-metadata`, CC-BY-NC-4.0).
This file is the audit trail required by the spec: "the application must
preserve provenance... create a data_dictionary.md documenting how each
visualization field maps to the original PGP field." No internal identity
is invented that can't be traced back to a source row.

Raw files live at `data/raw/pgp-metadata/data/*.csv` (fetched, not
committed — see README.md). See `results/pgp_data_profile.md` for the full
schema inspection, including where the CSVs diverge from their own README.

## Node: Document

| app field | source | notes |
|---|---|---|
| `id` | `documents.csv: pgpid` | PGP's own unique identifier, used verbatim as the node id |
| `url` | `documents.csv: url` | link back to the live PGP record — shown on every document node |
| `shelfmark` | `documents.csv: shelfmark` | |
| `type` | `documents.csv: type` | one of PGP's 9 document types (may be blank) |
| `description` | `documents.csv: description` | |
| `languages` | `documents.csv: languages_primary` (split on `;`/`,`) | secondary languages (`languages_secondary`) not surfaced in milestone 1 |
| `date_display` | `documents.csv: inferred_date_display`, falling back to `doc_date_standard` | free text; not standardized further |
| `library` / `collection` | `documents.csv: library`, `documents.csv: collection` | |
| `has_transcription` / `has_translation` | `documents.csv: has_transcription`, `documents.csv: has_translation` | Y/N as given |
| `tags` | `documents.csv: tags` | research-assistant-assigned tags, shown as-is, never used to infer new relationships |

## Node: Publication

| app field | source | notes |
|---|---|---|
| `id` | `sources.csv: slug` | PGP's own bibliographic slug |
| `citation` | `sources.csv: citation` | full-text citation as PGP generated it |
| `source_type` | `sources.csv: source_type` | |
| `year` | `sources.csv: year` | |
| `url` | `sources.csv: url` | may be empty (not every source has an online link) |

## Node: Place

| app field | source | notes |
|---|---|---|
| `id` | slugified `documents.csv` place-role value, cross-checked against `places.csv: name` | places.csv has no id column, only name + url slug, so the id is derived from the matched name |
| `name` | `places.csv: name` | |
| `coordinates` | `places.csv: coordinates` | free-text lat/long as PGP recorded it, not parsed into numbers for milestone 1 |
| `url` | `places.csv: url` | |

## Edge: Document —associated_with→ Place

| app field | source |
|---|---|
| `role` | which of `documents.csv`'s six columns the place name came from: `origin`, `destination`, `location`, `mentioned`, `possibly_mentioned`, `formerly_believed_to_be_mentioned` |
| evidence shown to user | "PGP document {pgpid} lists {place name} under its `{role}` field." — the role column name and raw value are shown verbatim |

## Edge: Document —cited_by→ Publication

| app field | source |
|---|---|
| `relation` | `footnotes.csv: doc_relation` (Edition / Translation / Discussion / Digital Edition / Digital Translation) |
| `location` | `footnotes.csv: location` (where in the source this footnote derives from) |
| evidence shown to user | the footnote row itself: source citation + doc_relation + location, joined `footnotes.document_id == documents.pgpid` and `footnotes.source_slug == sources.slug` |

## Edge: Document —shares_fragment→ Document

| app field | source |
|---|---|
| `shelfmark` | `fragments.csv: shelfmark` |
| evidence shown to user | "Documents {A} and {B} are both transcribed from fragment {shelfmark}" — derived from `fragments.csv: pgpids` listing more than one PGPID for the same fragment row |

## What is deliberately NOT in the graph

- **Person nodes/edges.** `people.csv` has no id column and no per-document
  join key in this export — only aggregate `related_documents_count`. Per
  spec section 6 ("only create relationships that can be justified from
  the source data"), we do not fabricate a document↔person edge by
  string-matching names. This is documented as a real limitation, not
  silently dropped — see `results/pgp_data_profile.md`.
- **Document —same_as/variant_of→ Document.** Not present in this
  metadata export (would require the full PGPv4 relational database).
- **Any semantic/embedding-based edge.** Milestone 1 ships only
  source-established relationships. If a semantic layer is added later
  (spec §13), those edges will be visually distinct (dashed lines,
  labeled "computationally similar") and will never be mixed into this
  table as if they were source-established.
