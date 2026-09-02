#!/usr/bin/env python3
"""Single entry point for the PGP data-preprocessing pipeline.

Usage:
    python run_pipeline.py

Runs, in order: inspect_pgp -> normalize -> build_graph -> export.
Requires the raw PGP metadata CSVs to already be fetched — see README.md.
Never modifies data/raw/.
"""
from __future__ import annotations

import sys
from pathlib import Path

from src import inspect_pgp, normalize, build_graph, export


def main() -> int:
    root = Path(__file__).resolve().parent
    raw_dir = root / "data" / "raw" / "pgp-metadata" / "data"
    if not raw_dir.exists():
        print(
            f"Raw PGP data not found at {raw_dir}.\n"
            "Fetch it first:\n\n"
            "  git clone --depth 1 https://github.com/princetongenizalab/pgp-metadata "
            "data/raw/pgp-metadata\n",
            file=sys.stderr,
        )
        return 1

    inspect_pgp.run()
    normalize.run()
    build_graph.run()
    export.run()

    print(
        "\nDone. Open webapp/index.html via a static server, e.g.:\n"
        "  cd webapp && python3 -m http.server 8000\n"
        "then visit http://localhost:8000/\n"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
