# AGENTS.md

## Cursor Cloud specific instructions

This repository is **data-only**: it ships datasets, not an application. There is no
server, build step, lint config, or automated test suite to run.

- Datasets:
  - `data/spacex-launches/` — `launches`, `timelines`, `carousel` as both `.csv` and `.parquet` (join on `slug`).
  - `data/tesla/tesla-production-delivery-history.xlsx` — Tesla production/delivery spreadsheet.
  - `tesla_data.json` — Tesla quarterly figures under the top-level `quarterly` key.
- The "development environment" is Python + pandas for loading/querying the data. Deps are
  listed in `requirements.txt` and installed by the update script (`pandas`, `pyarrow`, `openpyxl`).
- Non-obvious gotchas:
  - Reading the `.parquet` files requires `pyarrow`; reading the `.xlsx` requires `openpyxl`.
    Both are pulled in via `requirements.txt`.
  - Packages are installed into the system interpreter with `pip --break-system-packages`
    (Ubuntu 24.04 marks it externally-managed), so just use `python3` directly — there is no
    virtualenv to activate.
  - The `.csv` and `.parquet` SpaceX files are parallel exports of the same tables
    (688 launches / 3,913 timelines / 329 carousel rows); prefer `.parquet` for typed columns.
