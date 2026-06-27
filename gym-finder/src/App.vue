<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLocations } from './composables/useLocations.js'
import { useFilters } from './composables/useFilters.js'
import { useGeolocation } from './composables/useGeolocation.js'
import AppHeader from './components/AppHeader.vue'
import FilterPanel from './components/FilterPanel.vue'
import LocationList from './components/LocationList.vue'
import LocationMap from './components/LocationMap.vue'
import LocationDetail from './components/LocationDetail.vue'

const { locations, loading, error, fetchLocations } = useLocations()
const selected = ref(null)
const filters = ref({
  facilityType: '',
  maxPrice: null,
  freeOnly: false,
  nearMe: false,
})

const { filteredLocations } = useFilters(locations, filters)
const { userCoords, getUserLocation, sortByDistance } = useGeolocation()

// If nearMe is on, sort by distance, otherwise use filtered list as is
const displayedLocations = computed(() => {
  if (filters.value.nearMe && userCoords.value) {
    return sortByDistance(filteredLocations.value)
  }
  return filteredLocations.value
})

// When nearMe is toggled on, get user location
async function handleFiltersUpdate(newFilters) {
  filters.value = newFilters
  if (newFilters.nearMe && !userCoords.value) {
    try {
      await getUserLocation()
    } catch {
      // If denied, just uncheck nearMe
      filters.value = { ...filters.value, nearMe: false }
    }
  }
}

onMounted(() => fetchLocations())
</script>

<template>
  <div class="flex flex-col h-screen">
    <AppHeader />

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <p class="text-gray-400 animate-pulse">Loading venues...</p>
    </div>

    <div v-else-if="error" class="flex-1 flex items-center justify-center">
      <p class="text-red-400">Failed to load: {{ error }}</p>
    </div>

    <div v-else class="flex flex-1 overflow-hidden">
      <aside class="w-80 border-r bg-gray-50 flex flex-col overflow-hidden">
        <FilterPanel
          :filters="filters"
          @update:filters="handleFiltersUpdate"
        />
        <LocationList
          :locations="displayedLocations"
          @select="selected = $event"
        />
      </aside>
      <main class="flex-1 relative">
        <LocationMap
          :locations="displayedLocations"
          :selected="selected"
          @select="selected = $event"
        />
        <LocationDetail
          :location="selected"
          @close="selected = null"
        />
      </main>
    </div>

  </div>
</template>