# spacex

Local datasets for SpaceX launch history and related Tesla production/delivery data, plus interactive explorers for both.

## Contents

- `data/spacex-launches/` — SpaceX launches, timelines, and carousel tables (CSV + Parquet), sourced from [juliensimon/spacex-launches](https://huggingface.co/datasets/juliensimon/spacex-launches)
- `data/tesla/tesla-production-delivery-history.xlsx` — Tesla production and delivery history spreadsheet
- `tesla_data.json` — JSON export of Tesla quarterly production/delivery figures (quarterly totals, model deliveries, factory production)
- `web/` — SpaceX Launch Explorer (React + Vite)
- `canvas/` — Tesla Production Canvas (React + Vite)

See `data/spacex-launches/README.md` for column definitions and join notes.

## Tesla Production Canvas

Interactive dashboard for Tesla quarterly production and delivery data (2012 Q3 – 2025 Q4).

```bash
cd canvas
npm install
npm run data    # merge tesla_data.json → public/tesla.json
npm run dev     # http://localhost:5181
```

Features:
- Annual and quarterly production vs. delivery charts
- Factory production breakdown (Fremont, Shanghai, Berlin, Texas)
- Model delivery breakdown (Model S/X, Model 3, Model Y, Cybertruck)
- Year filters, quarter detail cards, and a detail drawer with YoY comparisons

## SpaceX Launch Explorer

```bash
cd web
npm install
npm run data    # merge CSVs → public/launches.json
npm run dev     # http://localhost:5180
```
