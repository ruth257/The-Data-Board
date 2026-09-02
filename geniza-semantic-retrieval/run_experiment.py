#!/usr/bin/env python3
"""Single entry point for the Genizah semantic-retrieval pilot.

Usage:
    python run_experiment.py

Runs Stage 0 (data inspection) first, always. If no real bibliographic
corpus is found under data/, the pipeline stops there by design — see
results/data_profile.md for what's missing — rather than fabricating or
downloading a substitute (project rule, see README.md § Research discipline).
"""
from __future__ import annotations

import sys

from src import data_profile


def main() -> int:
    result = data_profile.run()

    if not result.found_corpus:
        print(
            "\nSTOP: no bibliographic corpus found under data/.\n"
            "See results/data_profile.md for the precise data requirement report.\n"
            "This is expected behavior, not a bug — the pipeline will not proceed\n"
            "past data inspection on fabricated or downloaded substitute data.\n",
            file=sys.stderr,
        )
        return 1

    print(f"Data profile OK: {result.n_records} records from {result.source_path}.")
    print(
        "\nStages 1-6 (preprocessing, lexical baseline, embeddings, retrieval,\n"
        "comparison, visualization) are not implemented yet — see src/ for\n"
        "the sketched interfaces. Implement them against the now-available\n"
        "corpus before re-running.",
        file=sys.stderr,
    )
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
