import fs from 'fs'
import Papa from './gym-finder/node_modules/papaparse/papaparse.js'

const csv = fs.readFileSync('SportFacilities.csv', 'utf8')
const rows = Papa.parse(csv, { header: true, skipEmptyLines: true }).data

const GYM_DAY_PASS_PRICES = [2.5, 3, 4, 5, 6]
const GYM_MEMBERSHIP_PRICES = [90, 120, 180, 240, 300]
const POOL_DAY_PASS_PRICES = [1, 1.5, 2, 2.5]
const COURT_DAY_PASS_PRICES = [3, 4, 5, 6, 8]
const ROWS_PER_FILE = 400

function escapeSqlString(value) {
  return String(value).replace(/'/g, "''")
}

function sqlString(value) {
  return `'${escapeSqlString(value)}'`
}

function sqlArray(values) {
  if (!values.length) return 'ARRAY[]::text[]'
  return `ARRAY[${values.map((value) => sqlString(value)).join(',')}]`
}

function classifyFacilityType(facilityType, index) {
  const normalized = facilityType.toLowerCase()

  if (normalized.includes('gymnasium') || normalized.includes('gym')) {
    return {
      equipment: ['Treadmill', 'Dumbbells', 'Bench Press', 'Cable Machine', 'Stationary Bike'],
      amenities: ['Changing Rooms', 'Showers', 'Lockers', 'Water Cooler'],
      dayPassPrice: GYM_DAY_PASS_PRICES[index % GYM_DAY_PASS_PRICES.length],
      membershipPrice: GYM_MEMBERSHIP_PRICES[index % GYM_MEMBERSHIP_PRICES.length],
    }
  }

  if (normalized.includes('fitness corner')) {
    return {
      equipment: ['Pull-up Bars', 'Parallel Bars', 'Sit-up Bench'],
      amenities: ['Water Cooler', 'Shelter'],
      dayPassPrice: null,
      membershipPrice: null,
    }
  }

  if (normalized.includes('swimming pool')) {
    return {
      equipment: [],
      amenities: ['Changing Rooms', 'Showers', 'Lockers'],
      dayPassPrice: POOL_DAY_PASS_PRICES[index % POOL_DAY_PASS_PRICES.length],
      membershipPrice: null,
    }
  }

  if (
    normalized.includes('tennis court') ||
    normalized.includes('badminton court') ||
    normalized.includes('basketball court') ||
    normalized.includes('volleyball court') ||
    normalized.includes('table tennis court') ||
    normalized.includes('squash court') ||
    normalized.includes('court')
  ) {
    return {
      equipment: ['Nets', 'Court Lighting', 'Scoreboard'],
      amenities: ['Booking Counter', 'Water Cooler'],
      dayPassPrice: COURT_DAY_PASS_PRICES[index % COURT_DAY_PASS_PRICES.length],
      membershipPrice: null,
    }
  }

  if (
    normalized.includes('stadium') ||
    normalized.includes('track') ||
    normalized.includes('field') ||
    normalized.includes('football') ||
    normalized.includes('hockey')
  ) {
    return {
      equipment: [],
      amenities: ['Bleachers', 'Water Cooler', 'Toilets'],
      dayPassPrice: null,
      membershipPrice: null,
    }
  }

  return {
    equipment: [],
    amenities: ['Water Cooler'],
    dayPassPrice: null,
    membershipPrice: null,
  }
}

const byPostalAndFacilityType = new Map()

for (const row of rows) {
  const postalCode = String(row.PostalCode || '').trim()
  if (!/^\d{6}$/.test(postalCode)) continue
  if (!row.Latitude || !row.Longitude) continue

  const facilityType = String(row.SportsFacility || '').trim()
  if (!facilityType) continue

  const key = `${postalCode}::${facilityType}`
  if (!byPostalAndFacilityType.has(key)) {
    byPostalAndFacilityType.set(key, { postalCode, facilityType })
  }
}

const entries = [...byPostalAndFacilityType.values()].sort((a, b) => {
  const postalCompare = a.postalCode.localeCompare(b.postalCode)
  if (postalCompare !== 0) return postalCompare
  return a.facilityType.localeCompare(b.facilityType)
})

function buildInsertSql(values) {
  return `insert into public.gym_enrichments (
  postal_code,
  facility_type,
  equipment,
  amenities,
  day_pass_price,
  membership_price
)
values
${values}
on conflict (postal_code, facility_type) do update
set
  equipment = excluded.equipment,
  amenities = excluded.amenities,
  day_pass_price = excluded.day_pass_price,
  membership_price = excluded.membership_price;
`
}

for (const filename of fs.readdirSync('.')) {
  if (
    /^gym_enrichments_seed_part_\d{3}\.sql$/.test(filename) ||
    filename === 'gym_enrichments_seed_from_gov.sql'
  ) {
    fs.unlinkSync(filename)
  }
}

const partCounts = []

for (let start = 0; start < entries.length; start += ROWS_PER_FILE) {
  const chunk = entries.slice(start, start + ROWS_PER_FILE)
  const values = chunk
    .map(({ postalCode, facilityType }, index) => {
      const enrichment = classifyFacilityType(facilityType, start + index)

      return `  (${sqlString(postalCode)}, ${sqlString(facilityType)}, ${sqlArray(enrichment.equipment)}, ${sqlArray(enrichment.amenities)}, ${enrichment.dayPassPrice ?? 'null'}, ${enrichment.membershipPrice ?? 'null'})`
    })
    .join(',\n')

  const fileNumber = String(partCounts.length + 1).padStart(3, '0')
  const filename = `gym_enrichments_seed_part_${fileNumber}.sql`
  fs.writeFileSync(filename, buildInsertSql(values))
  partCounts.push({ filename, rowCount: chunk.length })
}

console.log(`Rows generated: ${entries.length}`)
console.log(`Part files created: ${partCounts.length}`)
for (const part of partCounts) {
  console.log(`${part.filename}: ${part.rowCount} rows`)
}
