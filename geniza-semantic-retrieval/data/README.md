# `data/` — expected input

This directory is currently empty. The pilot needs a real Friedberg Genizah
Project (or equivalent) bibliographic export placed here before
`run_experiment.py` can do anything beyond the data-inspection stage.

See `results/data_profile.md` for the precise requirement report (why the
pipeline stopped, what fields it looks for, and what a valid input file
looks like).

Do not put synthetic or hand-written placeholder records here to make the
pipeline "run" — see `README.md` § Research discipline. If you want a
disciplined toy run for demonstration purposes only, generate it under a
clearly separate path (e.g. `data/DEMO_synthetic/`) and never let
`config.yaml: data.input_path` point at it by default.
