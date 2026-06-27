<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useLocations } from './composables/useLocations.js'
import SidebarNav from './components/SidebarNav.vue'

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

      <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div v-if="isSearching" class="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <section class="min-h-[24rem] rounded-2xl border border-gray-200 bg-white p-4">
            <div class="mb-4 border-b border-gray-100 pb-3">
              <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Venues</p>
              <p class="mt-1 text-sm text-gray-600">{{ filteredLocations.length }} venues found</p>
            </div>

            <div v-if="filteredLocations.length" class="flex flex-col gap-3">
              <button
                v-for="location in filteredLocations"
                :key="location.id"
                type="button"
                class="w-full rounded-xl border p-4 text-left transition"
                :class="selected?.id === location.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'"
                @click="selected = location"
              >
                <h2 class="text-sm font-semibold text-gray-900">{{ location.name }}</h2>
                <p class="mt-1 text-xs text-gray-500">Postal code: {{ location.postalCode || 'N/A' }}</p>

                <div class="mt-3 flex flex-wrap gap-1">
                  <span
                    v-for="facility in location.facilityTypes"
                    :key="facility.type"
                    class="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
                  >
                    {{ facility.type }}
                  </span>
                </div>
              </button>
            </div>

            <div v-else class="flex min-h-[16rem] items-center justify-center">
              <div class="max-w-xs text-center">
                <h2 class="text-base font-medium text-gray-900">No matching venues</h2>
                <p class="mt-2 text-sm text-gray-500">
                  Try a different venue name or facility type.
                </p>
              </div>
            </div>
          </section>

          <section class="min-h-[24rem] rounded-2xl border border-gray-200 bg-white p-6">
            <div v-if="selected">
              <h2 class="text-xl font-semibold text-gray-900">{{ selected.name }}</h2>
              <p class="mt-1 text-sm text-gray-500">Postal code: {{ selected.postalCode || 'N/A' }}</p>

              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="facility in selected.facilityTypes"
                  :key="facility.type"
                  class="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
                >
                  {{ facility.type }}
                </span>
              </div>

              <div class="mt-6 space-y-4">
                <section
                  v-for="facility in selected.facilityTypes"
                  :key="facility.type"
                  class="rounded-xl border border-gray-200 p-4"
                >
                  <h3 class="text-sm font-medium text-gray-900">{{ facility.type }}</h3>

                  <div class="mt-3 space-y-1 text-sm text-gray-600">
                    <p>Free: <span class="font-medium text-gray-800">{{ facility.isFree ? 'Yes' : 'No' }}</span></p>
                    <p>
                      Day pass:
                      <span class="font-medium text-gray-800">
                        {{ facility.dayPassPrice !== null ? `$${facility.dayPassPrice}` : 'No pricing info' }}
                      </span>
                    </p>
                    <p>
                      Membership:
                      <span class="font-medium text-gray-800">
                        {{ facility.membershipPrice !== null ? `$${facility.membershipPrice}/yr` : 'No pricing info' }}
                      </span>
                    </p>
                  </div>

                  <div class="mt-4">
                    <p class="mb-2 text-xs uppercase tracking-wide text-gray-400">Equipment</p>
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="item in facility.equipment?.length ? facility.equipment : ['No equipment listed']"
                        :key="item"
                        class="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                      >
                        {{ item }}
                      </span>
                    </div>
                  </div>

                  <div class="mt-4">
                    <p class="mb-2 text-xs uppercase tracking-wide text-gray-400">Amenities</p>
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="item in facility.amenities?.length ? facility.amenities : ['No amenities listed']"
                        :key="item"
                        class="rounded bg-green-50 px-2 py-0.5 text-xs text-green-700"
                      >
                        {{ item }}
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div v-else-if="filteredLocations.length" class="flex h-full min-h-[24rem] items-center justify-center">
              <div class="max-w-sm text-center">
                <h2 class="text-lg font-medium text-gray-900">Select a venue</h2>
                <p class="mt-2 text-sm text-gray-500">
                  Choose a search result to inspect facility types, equipment, amenities, and pricing.
                </p>
              </div>
            </div>

            <div v-else class="flex h-full min-h-[24rem] items-center justify-center">
              <div class="max-w-sm text-center">
                <h2 class="text-lg font-medium text-gray-900">No venue selected</h2>
                <p class="mt-2 text-sm text-gray-500">
                  Details will appear here when a matching venue is selected.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div v-else class="flex min-h-[calc(100vh-3rem)] items-center justify-center">
          <div class="max-w-md text-center">
            <h2 class="text-lg font-medium text-gray-900">Start with a search</h2>
            <p class="mt-2 text-sm text-gray-500">
              Use the sidebar search field to find venues by name or facility type.
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
