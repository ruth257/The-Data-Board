# Graph Statistics

Sampled documents: 1500
Place nodes reachable from the sample: 109
Publication nodes reachable from the sample: 161

## Edges

| edge type | count | distinct source documents |
|---|---|---|
| associated_with_place | 456 | 276 |
| cited_by_publication | 1007 | 434 |
| shares_fragment | 40 | 29 |

Documents in the sample with **no** graph edge at all (isolated nodes — a real, expected finding, not a bug): 969

## Sampled document `type` distribution

| type | count |
|---|---|
| Letter | 496 |
| Legal document | 331 |
| List or table | 242 |
| (untyped) | 143 |
| Literary text | 96 |
| State document | 86 |
| Paraliterary text | 55 |
| Credit instrument or private receipt | 33 |
| Legal query or responsum | 18 |

## Notes

- No person nodes/edges: this PGP export has no document-level person join key (see data_dictionary.md).
- No inferred or semantic edges at this milestone — every edge above carries the raw source evidence that justifies it (see each edge's `evidence` field in relationships.json / graph.json).