# AGENTS.md

## Cursor Cloud specific instructions

This repo contains datasets (`data/`, `tesla_data.json`) plus a frontend-only web app
in `web/` (the "SpaceX Launch Explorer"). There is no backend service.

### Web app (`web/`)
- Stack: Vite + React + TypeScript. Commands are in `web/package.json` (run from `web/`).
  - Dev server: `npm run dev` — serves on a fixed port `5180` (set in `web/vite.config.ts`).
  - Build (also type-checks): `npm run build` (`tsc -b && vite build`).
  - There is no separate lint script; `npm run build` is the type/compile check.
- The app fetches `/launches.json` from `web/public/`. This file is committed and is the
  data the UI renders, so the app runs without regenerating it.
- `npm run data` (`python3 scripts/build-data.py`) regenerates `web/public/launches.json`
  from the CSVs in `data/spacex-launches/`. Only needed if the source CSVs change; uses
  the system `python3` (stdlib only, no extra packages).

### Gotchas
- `node_modules/` is committed to git but contains macOS (darwin-arm64) native binaries.
  On Linux you MUST run `npm install` in `web/` to pull the correct platform binaries
  (esbuild/rollup); the update script handles this. Do not commit the resulting
  `node_modules/` churn.
