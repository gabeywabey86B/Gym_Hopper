import { computed, unref } from 'vue'

function matchesEquipment(facility, selectedEquipment) {
  if (!selectedEquipment || selectedEquipment === 'any') return true

  return (facility.equipment ?? []).some((item) => item === selectedEquipment)
}

export function useFilters(locations, filters) {
  const filteredLocations = computed(() => {
    const sourceLocations = unref(locations) ?? []
    const activeFilters = unref(filters) ?? {}
    const normalizedQuery = activeFilters.query?.trim().toLowerCase() ?? ''
    const maxDayPassPrice = activeFilters.maxDayPassPrice

    return sourceLocations.reduce((results, location) => {
      const venueNameMatch = normalizedQuery
        ? location.name?.toLowerCase().includes(normalizedQuery)
        : true

      const matchingFacilities = (location.facilityTypes ?? []).filter((facility) => {
        const facilityTypeMatch = normalizedQuery
          ? facility.type?.toLowerCase().includes(normalizedQuery)
          : true

        if (normalizedQuery && !venueNameMatch && !facilityTypeMatch) return false
        if (activeFilters.freeOnly && !facility.isFree) return false

        if (maxDayPassPrice !== null && maxDayPassPrice !== undefined) {
          if (facility.dayPassPrice === null || facility.dayPassPrice > maxDayPassPrice) {
            return false
          }
        }

        if (!matchesEquipment(facility, activeFilters.equipment)) return false

        return true
      })

      if (!matchingFacilities.length) return results

      results.push({
        ...location,
        facilityTypes: matchingFacilities,
      })

      return results
    }, [])
  })

  return { filteredLocations }
}
