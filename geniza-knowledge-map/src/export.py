"""Stage 3: copy the processed JSON bundle into webapp/data/ so the static
front end (no backend, no database — see README §20) can fetch it directly."""
from __future__ import annotations

import shutil
from pathlib import Path

import yaml

FILES = ["documents.json", "publications.json", "relationships.json", "graph.json"]


def run(config_path: str = "config.yaml", project_root: str | None = None) -> None:
    root = Path(project_root) if project_root else Path(__file__).resolve().parent.parent
    with open(root / config_path, "r", encoding="utf-8") as fh:
        config = yaml.safe_load(fh)

    processed_dir = root / config["data"]["processed_dir"]
    webapp_data_dir = root / config["output"]["webapp_data_dir"]
    webapp_data_dir.mkdir(parents=True, exist_ok=True)

    for name in FILES:
        src = processed_dir / name
        if not src.exists():
            raise FileNotFoundError(f"{src} missing — run build_graph.py first.")
        shutil.copy2(src, webapp_data_dir / name)

    print(f"Copied {len(FILES)} files to {webapp_data_dir}")


if __name__ == "__main__":
    run()
