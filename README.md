# Sup Hackathon

This repository contains a hackathon project focused on helping people find public sports and gym facilities in Singapore.

The main product is a Vue 3 + Vite frontend in `gym-finder/`. It loads facility data from the Singapore government sports facilities dataset, merges that data with custom enrichment records stored in Supabase, and presents the results in a searchable, filterable map-based interface.

## What the project does

- Shows sports facilities with map and list views.
- Filters locations by facility type, pricing, free access, and proximity to the user.
- Enriches raw public facility records with extra details such as equipment, amenities, day-pass pricing, and membership pricing.
- Groups multiple facility types at the same postal code into a single location entry in the UI.

## Repository structure

- `gym-finder/`: the frontend application built with Vue 3 and Vite.
- `generate_gym_seed.mjs`: generates SQL seed files for the enrichment table based on `SportFacilities.csv`.
- `create_gym_enrichments.sql`: creates the Supabase/Postgres table used for enrichment data.
- `gym_enrichments_seed_part_*.sql`: generated seed files for populating the enrichment table.
- `SportFacilities.csv`, `gymsatsg_test.json`: local source data snapshots used during development.
- `testing_api/`: small scripts used to inspect and test the public datasets and related API responses.

## Data flow

1. The frontend fetches facility records from the public `data.gov.sg` sports facilities dataset.
2. It fetches enrichment rows from the `gym_enrichments` table in Supabase.
3. The app joins both sources by postal code and facility type.
4. The merged result is displayed in the UI and can be filtered by the user.

## Local development

The frontend lives in `gym-finder/`.

```bash
cd gym-finder
npm install
npm run dev
```

The app expects Supabase credentials in local environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Notes

- The enrichment SQL files appear to be generated artifacts, not hand-maintained source files.
- The root `package-lock.json` is minimal; the active application dependencies are defined in `gym-finder/package.json`.
