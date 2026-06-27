import { computed } from 'vue'

export function useFilters(locations, filters) {
  const filteredLocations = computed(() => {
    return locations.value.filter(loc => {

      // Facility type filter
      if (filters.value.facilityType) {
        if (!loc.facilityTypes.includes(filters.value.facilityType)) return false
      }

      // Free only filter
      if (filters.value.freeOnly) {
        if (!loc.isFree) return false
      }

      // Max price filter
      if (filters.value.maxPrice !== null) {
        if (loc.dayPassPrice && loc.dayPassPrice > filters.value.maxPrice) return false
      }

      return true
    })
  })

  return { filteredLocations }
}