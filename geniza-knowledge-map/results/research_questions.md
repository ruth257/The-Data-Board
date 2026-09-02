# Research Questions Log

Per spec §27: observations recorded during development, not premature
answers. This is a running log, not a conclusions section — see
README.md §26 for what "success" would actually look like.

## From building milestone 1

- **Which relationships are most useful?** Too early to say from real use
  — no one has explored the app yet. What we do know from
  `results/graph_statistics.md`: at a 1,500-document random sample,
  `cited_by_publication` produces far more edges (1,007) than
  `associated_with_place` (456) or `shares_fragment` (40). Whether that
  translates to more *interesting* discoveries, or just more clutter, is
  an open question — publication co-citation edges connect any two
  documents that happen to appear in the same secondary-literature
  footnote, which is a weaker signal of thematic relatedness than a
  shared place mention.

- **Does the graph overwhelm the user?** Progressive disclosure (nothing
  renders until searched/expanded) was a deliberate response to this
  concern before any user touched the app — worth specifically watching
  for once someone does.

- **Which relationships are obvious in the raw data but invisible in
  conventional records?** One concrete, verified example: PGP's own
  `pgp-metadata` README claims links between "places... and documents"
  are *not* included in this data export. They are — embedded directly in
  `documents.csv`'s six role columns (origin/destination/location/
  mentioned/possibly_mentioned/formerly_believed_to_be_mentioned), 9,557
  mentions in total, 100% matchable to `places.csv` names. A researcher
  reading only the README, or browsing the PGP website's document pages
  one at a time, would have no easy way to ask "what other documents
  mention this same place?" — that question only becomes cheap to ask
  once the relationship is modeled as a graph. See
  `results/example_paths.json` for a captured instance of exactly this
  (two documents connected only through a shared "Mediterranean Sea"
  mention, no shared vocabulary otherwise).

- **Which relationships appear computationally but require scholarly
  verification?** None yet — milestone 1 deliberately ships zero
  computational/inferred edges (see data_dictionary.md). This question
  becomes live only once milestone 2 (semantic similarity) is attempted.

- **Which node types deserve visual prominence?** Open question. Current
  styling gives documents/places/publications equal visual weight
  (distinguished by shape/color only). Person nodes are absent entirely —
  a real gap, not a design choice (see data_dictionary.md).

- **Does the temporal view reveal changes in scholarly attention?** Not
  yet built (milestone 3, not attempted).

- **Does the representation encourage different questions?** This is the
  actual research question and can't be answered from development alone
  — it requires a person other than the builder using the tool. That's
  the reason this project exists.

## A specific methodological worry surfaced while building

The `cited_by_publication` edge conflates very different kinds of
citation (`doc_relation` values: Digital Edition, Edition, Discussion,
Digital Translation, Translation — see `results/pgp_data_profile.md`).
Two documents that are both merely *listed* by the same survey source
("Discussion") are a much weaker connection than two documents both
critically edited by the same scholar. The app currently shows
`doc_relation` in the evidence text but does not let a user filter or
weight by it. Worth testing whether that distinction matters in practice
before building filtering UI for it.
