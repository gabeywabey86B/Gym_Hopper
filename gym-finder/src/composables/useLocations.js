import { ref } from 'vue'
import Papa from 'papaparse'
import { supabase } from '../lib/supabase.js'

const CSV_URL = 'https://data.gov.sg/api/action/datastore_search?resource_id=d_2cfb0867cdeb2b7303068995699dc33b&limit=5000'

export function useLocations() {
  const locations = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchLocations() {
    loading.value = true
    error.value = null

    try {
      // 1. Fetch from data.gov.sg
      const res = await fetch(CSV_URL)
      const json = await res.json()
      const records = json.result.records
      console.log('gov sample', records.slice(0, 5))
      console.log(records[0])

      // 2. Fetch enrichments from Supabase
      const { data: enrichments, error: sbError } = await supabase
        .from('gym_enrichments')
        .select('*')

      if (sbError) throw sbError
      console.log('supabase enrichments count', enrichments?.length)
      console.log('supabase sample', enrichments?.slice(0, 5))

      // 3. Build enrichment lookup by postal code
      const enrichmentMap = {}
      for (const e of enrichments ?? []) {
        enrichmentMap[String(e.postal_code || '').trim()] = e
      }
      console.log('enrichment keys sample', Object.keys(enrichmentMap).slice(0, 20))
      console.log('first gov postal codes', records.slice(0, 20).map(r => r.PostalCode))

      // 4. Merge and map to unified location objects
      const mapped = records
        .filter(r => r.Latitude && r.Longitude)
        .map((r, i) => {
          const postalCode = String(r.PostalCode || '').trim()
          const enrichment = enrichmentMap[postalCode] ?? {}
          if (i < 20) {
            console.log('join check', {
              gymName: r.VenueName,
              govPostal: r.PostalCode,
              normalizedPostal: postalCode,
              foundSupabaseData: Boolean(enrichmentMap[postalCode]),
              supabaseData: enrichment,
            })
          }
          return {
            id: i,
            name: r.VenueName,
            postalCode,
            lat: parseFloat(r.Latitude),
            lng: parseFloat(r.Longitude),
            facilityTypes: r.SportsFacility
              ? r.SportsFacility.split(',').map(s => s.trim())
              : [],
            membershipPrice: enrichment.membership_price ?? null,
            dayPassPrice: enrichment.day_pass_price ?? null,
            equipment: enrichment.equipment ?? [],
            facilities: enrichment.facilities ?? [],
            isFree: !enrichment.day_pass_price && !enrichment.membership_price,
          }
        })

        const grouped = {}
        for (const loc of mapped) {
          if (grouped[loc.postalCode]) {
            // Merge facility types without duplicates
            const existing = grouped[loc.postalCode]
            existing.facilityTypes = [
              ...new Set([...existing.facilityTypes, ...loc.facilityTypes])
            ]
            // Keep the name of the first one, or pick the shortest/most generic
          } else {
            grouped[loc.postalCode] = { ...loc }
          }
        }

        // locations.value = Object.values(grouped)

        const aggregated = Object.values(grouped)
        console.log('after aggregation', aggregated)
        console.table(aggregated)
        window.__aggregatedLocations = aggregated

        locations.value = aggregated
    } catch (err) {
      error.value = err.message
      console.error('Failed to load locations:', err)
    } finally {
      loading.value = false
    }
  }

  return { locations, loading, error, fetchLocations }
}
