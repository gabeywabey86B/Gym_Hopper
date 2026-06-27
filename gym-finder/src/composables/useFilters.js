import { computed, unref } from 'vue'

const EQUIPMENT_LEVELS = {
  none: 0,
  basic: 1,
  standard: 2,
  full: 3,
}

function getEquipmentLevel(facility) {
  const equipmentCount = facility.equipment?.length ?? 0

  if (equipmentCount === 0) return 'none'
  if (equipmentCount <= 3) return 'basic'
  if (equipmentCount <= 5) return 'standard'
  return 'full'
}

function matchesMinimumEquipmentLevel(facility, minimumLevel) {
  if (!minimumLevel || minimumLevel === 'any') return true

  const facilityLevel = getEquipmentLevel(facility)
  return EQUIPMENT_LEVELS[facilityLevel] >= EQUIPMENT_LEVELS[minimumLevel]
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

        if (!matchesMinimumEquipmentLevel(facility, activeFilters.equipmentLevel)) return false

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
