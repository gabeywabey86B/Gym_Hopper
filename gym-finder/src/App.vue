<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useFilters } from './composables/useFilters.js'
import { useLocations } from './composables/useLocations.js'
import BackgroundMap from './components/BackgroundMap.vue'
import SidebarNav from './components/SidebarNav.vue'
import VenueCard from './components/VenueCard.vue'
import VenueDetailsCard from './components/VenueDetailsCard.vue'

const { locations, loading, error, fetchLocations } = useLocations()
const selected = ref(null)
const sidebarOpen = ref(true)
const preserveSelectionOnFilterReset = ref(false)
const filters = reactive({
  query: '',
  freeOnly: false,
  maxDayPassPrice: null,
  equipment: 'any',
})
const { filteredLocations } = useFilters(locations, filters)

const equipmentOptions = computed(() => {
  const options = new Set()

  for (const location of locations.value) {
    for (const facility of location.facilityTypes ?? []) {
      for (const item of facility.equipment ?? []) {
        if (item) options.add(item)
      }
    }
  }

  return [...options].sort((left, right) => left.localeCompare(right))
})

const hasActiveFilters = computed(() => (
  filters.query.trim().length > 0
  || filters.freeOnly
  || filters.maxDayPassPrice !== null
  || filters.equipment !== 'any'
))

const mapLocations = computed(() => (
  hasActiveFilters.value ? filteredLocations.value : locations.value
))

function resetFilters() {
  filters.query = ''
  filters.freeOnly = false
  filters.maxDayPassPrice = null
  filters.equipment = 'any'
}

function handleMapSelect(location) {
  if (hasActiveFilters.value) {
    preserveSelectionOnFilterReset.value = true
    resetFilters()
  }

  selected.value = location
}

watch(filters, () => {
  if (preserveSelectionOnFilterReset.value) {
    preserveSelectionOnFilterReset.value = false
    return
  }

  selected.value = null
}, { deep: true })

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
        :query="filters.query"
        :free-only="filters.freeOnly"
        :max-day-pass-price="filters.maxDayPassPrice"
        :equipment="filters.equipment"
        :equipment-options="equipmentOptions"
        :has-active-filters="hasActiveFilters"
        title="Gym Hopper"
        @toggle="sidebarOpen = !sidebarOpen"
        @search="sidebarOpen = true"
        @update:query="filters.query = $event"
        @update:free-only="filters.freeOnly = $event"
        @update:max-day-pass-price="filters.maxDayPassPrice = $event"
        @update:equipment="filters.equipment = $event"
        @reset-filters="resetFilters"
      />

      <main class="relative flex-1 overflow-hidden">
        <BackgroundMap
          :locations="mapLocations"
          :selected-location="selected"
          @select="handleMapSelect"
        />

        <div class="pointer-events-none absolute inset-0 z-[1000] px-4 py-6 sm:px-6 lg:px-8">
          <div
            v-if="hasActiveFilters || selected"
            class="grid gap-6 pointer-events-auto"
            :class="hasActiveFilters ? 'max-w-[56rem] lg:grid-cols-2' : 'max-w-[28rem]'"
          >
            <section
              v-if="hasActiveFilters"
              class="flex h-[calc(100vh-3rem)] min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm"
            >
              <div class="border-b border-gray-100 px-4 pb-3 pt-4">
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0">
                    <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Venues</p>
                    <p class="mt-1 text-sm text-gray-600">{{ filteredLocations.length }} venues found</p>
                  </div>

                  <button
                    type="button"
                    class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                    aria-label="Close filtered venues"
                    @click="resetFilters"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.8"
                    >
                      <path d="M5 5l10 10" />
                      <path d="M15 5L5 15" />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="filteredLocations.length" class="flex-1 overflow-y-auto p-4">
                <div class="flex flex-col gap-3">
                  <VenueCard
                    v-for="location in filteredLocations"
                    :key="location.id"
                    :location="location"
                    :selected="selected?.id === location.id"
                    @select="selected = $event"
                    @close="selected = null"
                  />
                </div>
              </div>

              <div v-else class="flex flex-1 items-center justify-center p-4">
                <div class="max-w-xs text-center">
                  <h2 class="text-base font-medium text-gray-900">No matching venues</h2>
                  <p class="mt-2 text-sm text-gray-500">
                    Try a different search or adjust your filters.
                  </p>
                </div>
              </div>
            </section>

            <VenueDetailsCard
              v-if="selected"
              :location="selected"
              :has-results="filteredLocations.length > 0"
              @close="selected = null"
            />
          </div>

        </div>
      </main>
    </div>
  </div>
</template>
