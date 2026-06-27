import { computed } from 'vue'

export function useFilters(locations, filters) {
  const filteredLocations = computed(() => {
    return locations.value.filter(loc => {
      // Facility type filter
      if (filters.value.facilityType) {
        if (!loc.facilityTypes.some(f => f.type === filters.value.facilityType)) return false
      }

      // Free only filter
      if (filters.value.freeOnly) {
        if (!loc.facilityTypes.some(f => f.isFree)) return false
      }

      // Max price filter
      if (filters.value.maxPrice !== null) {
        if (!loc.facilityTypes.some(f => f.dayPassPrice !== null && f.dayPassPrice <= filters.value.maxPrice)) {
          return false
        }
      }

      return true
    })
  })

  return { filteredLocations }
}
