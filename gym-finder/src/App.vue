<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useLocations } from './composables/useLocations.js'
import BackgroundMap from './components/BackgroundMap.vue'
import SidebarNav from './components/SidebarNav.vue'
import VenueCard from './components/VenueCard.vue'
import VenueDetailsCard from './components/VenueDetailsCard.vue'

const { locations, loading, error, fetchLocations } = useLocations()
const selected = ref(null)
const sidebarOpen = ref(true)
const searchQuery = ref('')

const normalizedSearch = computed(() => searchQuery.value.trim().toLowerCase())
const isSearching = computed(() => normalizedSearch.value.length > 0)

const filteredLocations = computed(() => {
  if (!isSearching.value) return []

  return locations.value.filter((location) => {
    const nameMatch = location.name?.toLowerCase().includes(normalizedSearch.value)
    const facilityMatch = location.facilityTypes?.some((facility) =>
      facility.type?.toLowerCase().includes(normalizedSearch.value)
    )

    return nameMatch || facilityMatch
  })
})

const mapLocations = computed(() => (
  isSearching.value ? filteredLocations.value : locations.value
))

watch(searchQuery, () => {
  selected.value = null
})

onMounted(() => {
  fetchLocations()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="loading" class="flex min-h-screen items-center justify-center px-6">
      <p class="text-sm text-gray-500 animate-pulse">Loading venues...</p>
    </div>

    <div v-else-if="error" class="flex min-h-screen items-center justify-center px-6">
      <p class="text-sm text-red-600">Failed to load venues: {{ error }}</p>
    </div>

    <div v-else class="flex min-h-screen">
      <SidebarNav
        :is-open="sidebarOpen"
        :query="searchQuery"
        title="Gym Finder SG"
        @toggle="sidebarOpen = !sidebarOpen"
        @search="sidebarOpen = true"
        @update:query="searchQuery = $event"
      />

      <main class="relative flex-1 overflow-hidden">
        <BackgroundMap
          :locations="mapLocations"
          :selected-location="selected"
        />

        <div class="relative z-[1000] px-4 py-6 sm:px-6 lg:px-8">
          <div
          v-if="isSearching"
          class="grid max-w-[56rem] gap-6 lg:grid-cols-2"
          >
            <section class="flex h-[calc(100vh-3rem)] min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
              <div class="border-b border-gray-100 px-4 pb-3 pt-4">
                <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Venues</p>
                <p class="mt-1 text-sm text-gray-600">{{ filteredLocations.length }} venues found</p>
              </div>

              <div v-if="filteredLocations.length" class="flex-1 overflow-y-auto p-4">
                <div class="flex flex-col gap-3">
                  <VenueCard
                    v-for="location in filteredLocations"
                    :key="location.id"
                    :location="location"
                    :selected="selected?.id === location.id"
                    @select="selected = $event"
                  />
                </div>
              </div>

              <div v-else class="flex flex-1 items-center justify-center p-4">
                <div class="max-w-xs text-center">
                  <h2 class="text-base font-medium text-gray-900">No matching venues</h2>
                  <p class="mt-2 text-sm text-gray-500">
                    Try a different venue name or facility type.
                  </p>
                </div>
              </div>
            </section>

            <VenueDetailsCard
              v-if="selected"
              :location="selected"
              :has-results="filteredLocations.length > 0"
            />
          </div>

          <div v-else class="flex min-h-[calc(100vh-3rem)] items-center justify-center">
            <div class="max-w-md rounded-2xl border border-white/60 bg-white/92 px-8 py-10 text-center shadow-sm backdrop-blur-sm">
              <h2 class="text-lg font-medium text-gray-900">Start with a search</h2>
              <p class="mt-2 text-sm text-gray-500">
                Use the sidebar search field to find venues by name or facility type.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
