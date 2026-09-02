"""Stage 2: build the explicit relationship graph for the sampled documents.

Only the three edge types justified by results/pgp_data_profile.md are
built here (associated_with_place, cited_by_publication, shares_fragment).
No PERSON edges, no inferred/semantic edges — see data_dictionary.md for
why. Every edge carries the raw evidence that justifies it, per spec §12
("why am I seeing this?").
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import pandas as pd
import yaml

PLACE_ROLE_COLUMNS = [
    "origin", "destination", "location", "mentioned",
    "possibly_mentioned", "formerly_believed_to_be_mentioned",
]

PLACE_URL_SLUG_RE = re.compile(r"/places/([^/]+)/?$")


def _split_multi(value: str) -> list[str]:
    if not value:
        return []
    return [p.strip() for p in re.split(r"[;,]", value) if p.strip()]


def build_place_nodes(places_df: pd.DataFrame) -> dict[str, dict]:
    """name -> place node, keyed for lookup while building edges."""
    by_name: dict[str, dict] = {}
    for _, row in places_df.iterrows():
        url = row.get("url", "") or ""
        m = PLACE_URL_SLUG_RE.search(url)
        slug = m.group(1) if m else f"place-{len(by_name)}"
        node = {
            "id": f"place:{slug}",
            "type": "place",
            "name": row.get("name", ""),
            "coordinates": row.get("coordinates", "") or None,
            "is_region": row.get("is_region", "") == "Y",
            "url": url or None,
        }
        by_name[row.get("name", "").strip()] = node
    return by_name


def build_place_edges(documents: list[dict], places_by_name: dict[str, dict]) -> tuple[list[dict], dict[str, dict]]:
    edges = []
    used_places: dict[str, dict] = {}
    for doc in documents:
        for mention in doc["place_mentions"]:
            place = places_by_name.get(mention["place_name"])
            if place is None:
                continue  # shouldn't happen per pgp_data_profile.md (100% match), but never fabricate
            used_places[place["id"]] = place
            edges.append({
                "id": f"place-edge:{doc['id']}:{place['id']}:{mention['role']}",
                "source": f"document:{doc['id']}",
                "target": place["id"],
                "type": "associated_with_place",
                "role": mention["role"],
                "evidence": (
                    f"PGP document {doc['id']} lists \"{mention['place_name']}\" "
                    f"under its `{mention['role']}` field."
                ),
            })
    return edges, used_places


def build_publication_nodes_and_edges(
    doc_ids: set[str], footnotes_df: pd.DataFrame, sources_df: pd.DataFrame
) -> tuple[list[dict], list[dict]]:
    sources_by_slug = {row["slug"]: row for _, row in sources_df.iterrows()}
    pub_nodes: dict[str, dict] = {}
    edges = []
    relevant = footnotes_df[footnotes_df["document_id"].isin(doc_ids)]
    for _, fn in relevant.iterrows():
        slug = fn.get("source_slug", "")
        src = sources_by_slug.get(slug)
        if src is None:
            continue  # footnote cites a source not present in sources.csv; never fabricate one
        pub_id = f"publication:{slug}"
        if pub_id not in pub_nodes:
            pub_nodes[pub_id] = {
                "id": pub_id,
                "type": "publication",
                "citation": src.get("citation", ""),
                "source_type": src.get("source_type", "") or None,
                "year": src.get("year", "") or None,
                "url": src.get("url", "") or None,
            }
        edges.append({
            "id": f"pub-edge:{fn['document_id']}:{pub_id}:{fn.name}",
            "source": f"document:{fn['document_id']}",
            "target": pub_id,
            "type": "cited_by_publication",
            "relation": fn.get("doc_relation", "") or None,
            "evidence": (
                f"footnotes.csv links PGP document {fn['document_id']} to source "
                f"\"{src.get('citation', slug)}\" "
                f"(doc_relation: {fn.get('doc_relation', '(unspecified)')}"
                + (f", location: {fn['location']}" if fn.get("location") else "")
                + ")."
            ),
        })
    return list(pub_nodes.values()), edges


def build_shares_fragment_edges(doc_ids: set[str], fragments_df: pd.DataFrame) -> list[dict]:
    edges = []
    for _, row in fragments_df.iterrows():
        ids = [i for i in _split_multi(row.get("pgpids", "")) if i in doc_ids]
        if len(ids) < 2:
            continue
        shelfmark = row.get("shelfmark", "")
        for i in range(len(ids)):
            for j in range(i + 1, len(ids)):
                edges.append({
                    "id": f"fragment-edge:{shelfmark}:{ids[i]}:{ids[j]}",
                    "source": f"document:{ids[i]}",
                    "target": f"document:{ids[j]}",
                    "type": "shares_fragment",
                    "shelfmark": shelfmark,
                    "evidence": (
                        f"Documents {ids[i]} and {ids[j]} are both transcribed from "
                        f"fragment \"{shelfmark}\" (fragments.csv lists both PGPIDs "
                        f"for this shelfmark)."
                    ),
                })
    return edges


def render_statistics(documents, place_nodes, pub_nodes, place_edges, pub_edges, fragment_edges) -> str:
    n_docs = len(documents)
    type_counts: dict[str, int] = {}
    for d in documents:
        t = d["doc_type"] or "(untyped)"
        type_counts[t] = type_counts.get(t, 0) + 1

    docs_with_place = len({e["source"] for e in place_edges})
    docs_with_pub = len({e["source"] for e in pub_edges})
    docs_with_fragment = len({e["source"] for e in fragment_edges} | {e["target"] for e in fragment_edges})

    lines = [
        "# Graph Statistics",
        "",
        f"Sampled documents: {n_docs}",
        f"Place nodes reachable from the sample: {len(place_nodes)}",
        f"Publication nodes reachable from the sample: {len(pub_nodes)}",
        "",
        "## Edges",
        "",
        "| edge type | count | distinct source documents |",
        "|---|---|---|",
        f"| associated_with_place | {len(place_edges)} | {docs_with_place} |",
        f"| cited_by_publication | {len(pub_edges)} | {docs_with_pub} |",
        f"| shares_fragment | {len(fragment_edges)} | {docs_with_fragment} |",
        "",
        f"Documents in the sample with **no** graph edge at all "
        f"(isolated nodes — a real, expected finding, not a bug): "
        f"{n_docs - len({e['source'] for e in place_edges + pub_edges} | {e['source'] for e in fragment_edges} | {e['target'] for e in fragment_edges})}",
        "",
        "## Sampled document `type` distribution",
        "",
        "| type | count |",
        "|---|---|",
    ]
    for t, c in sorted(type_counts.items(), key=lambda kv: -kv[1]):
        lines.append(f"| {t} | {c} |")
    lines += [
        "",
        "## Notes",
        "",
        "- No person nodes/edges: this PGP export has no document-level "
        "person join key (see data_dictionary.md).",
        "- No inferred or semantic edges at this milestone — every edge "
        "above carries the raw source evidence that justifies it (see "
        "each edge's `evidence` field in relationships.json / graph.json).",
    ]
    return "\n".join(lines)


def run(config_path: str = "config.yaml", project_root: str | None = None) -> None:
    root = Path(project_root) if project_root else Path(__file__).resolve().parent.parent
    with open(root / config_path, "r", encoding="utf-8") as fh:
        config = yaml.safe_load(fh)

    raw_dir = root / config["data"]["raw_dir"]
    processed_dir = root / config["data"]["processed_dir"]
    results_dir = root / config["output"]["results_dir"]
    processed_dir.mkdir(parents=True, exist_ok=True)
    results_dir.mkdir(parents=True, exist_ok=True)

    documents = json.loads((processed_dir / "documents.json").read_text(encoding="utf-8"))
    doc_ids = {d["id"] for d in documents}

    places_df = pd.read_csv(raw_dir / "places.csv", encoding="utf-8-sig", dtype=str, keep_default_na=False)
    sources_df = pd.read_csv(raw_dir / "sources.csv", encoding="utf-8-sig", dtype=str, keep_default_na=False)
    footnotes_df = pd.read_csv(raw_dir / "footnotes.csv", encoding="utf-8-sig", dtype=str, keep_default_na=False)
    fragments_df = pd.read_csv(raw_dir / "fragments.csv", encoding="utf-8-sig", dtype=str, keep_default_na=False)

    places_by_name = build_place_nodes(places_df)
    place_edges, used_places = build_place_edges(documents, places_by_name)
    pub_nodes, pub_edges = build_publication_nodes_and_edges(doc_ids, footnotes_df, sources_df)
    fragment_edges = build_shares_fragment_edges(doc_ids, fragments_df)

    # Note: the override keys must come *after* **d in the dict literal, or
    # d's own "id"/"type" keys (the raw pgpid / doc type) win instead.
    doc_nodes = [{**d, "id": f"document:{d['id']}", "type": "document"} for d in documents]
    all_nodes = doc_nodes + list(used_places.values()) + pub_nodes
    all_edges = place_edges + pub_edges + fragment_edges

    (processed_dir / "publications.json").write_text(
        json.dumps(pub_nodes, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (processed_dir / "relationships.json").write_text(
        json.dumps(all_edges, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (processed_dir / "graph.json").write_text(
        json.dumps({"nodes": all_nodes, "edges": all_edges}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    stats = render_statistics(documents, used_places, pub_nodes, place_edges, pub_edges, fragment_edges)
    (results_dir / "graph_statistics.md").write_text(stats, encoding="utf-8")

    print(
        f"Graph: {len(all_nodes)} nodes ({len(doc_nodes)} documents, "
        f"{len(used_places)} places, {len(pub_nodes)} publications), "
        f"{len(all_edges)} edges."
    )


if __name__ == "__main__":
    run()
