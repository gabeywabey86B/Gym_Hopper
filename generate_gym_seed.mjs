import fs from 'fs'
import Papa from './gym-finder/node_modules/papaparse/papaparse.js'

const csv = fs.readFileSync('SportFacilities.csv', 'utf8')
const rows = Papa.parse(csv, { header: true, skipEmptyLines: true }).data

const byPostal = new Map()
for (const row of rows) {
  const postalCode = String(row.PostalCode || '').trim()

  if (!/^\d{6}$/.test(postalCode)) continue
  if (!row.Latitude || !row.Longitude) continue

  if (!byPostal.has(postalCode)) byPostal.set(postalCode, new Set())
  byPostal.get(postalCode).add(row.SportsFacility)
}

const currentSql = fs.readFileSync('gym_enrichments_rows.sql', 'utf8')
const existingPostals = [...currentSql.matchAll(/\('([^']+)'/g)].map((m) => m[1])

const values = [...byPostal.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([postal, types], i) => {
    const text = [...types].join(' ').toLowerCase()
    const isGym = text.includes('gym') || text.includes('fitness')
    const isPool = text.includes('pool') || text.includes('swimming')
    const isCourt = text.includes('court') || text.includes('tennis') || text.includes('badminton')

    const membership = isGym ? [90, 120, 180, 240, 300][i % 5] : null
    const dayPass = isGym ? [2.5, 3, 4, 5, 6][i % 5] : isPool ? [1, 1.5, 2, 2.5][i % 4] : isCourt ? [3, 4, 5, 6][i % 4] : null

    const equipment = isGym
      ? "ARRAY['Treadmill','Dumbbells','Bench Press','Cable Machine']"
      : isCourt
        ? "ARRAY['Nets','Court Lighting','Scoreboard']"
        : 'ARRAY[]::text[]'

    const facilities = isPool || isGym
      ? "ARRAY['Parking','Water Cooler','Changing Rooms','Showers','Lockers']"
      : "ARRAY['Parking','Water Cooler']"

    return `  ('${postal}', ${membership ?? 'null'}, ${dayPass ?? 'null'}, ${equipment}, ${facilities})`
  })
  .join(',\n')

const sql = `-- Mock enrichment seed generated from SportFacilities.csv.
-- Matches every unique postal code with latitude/longitude in the gov dataset.
-- Safe to rerun: skips postal codes already present.

INSERT INTO public.gym_enrichments (postal_code, membership_price, day_pass_price, equipment, facilities)
SELECT v.postal_code, v.membership_price, v.day_pass_price, v.equipment, v.facilities
FROM (VALUES
${values}
) AS v(postal_code, membership_price, day_pass_price, equipment, facilities)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.gym_enrichments ge
  WHERE ge.postal_code = v.postal_code
);
`

fs.writeFileSync('gym_enrichments_seed_from_gov.sql', sql)
console.log(`Created gym_enrichments_seed_from_gov.sql`)
console.log(`Rows generated: ${byPostal.size}`)
console.log(`Current Supabase rows detected: ${existingPostals.length}`)
