<script setup>
    import { ref, onMounted } from 'vue'
    import { useLocations } from './composables/useLocations.js'
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

    onMounted(() => fetchLocations())
</script>

<template>
  <div class="flex flex-col h-screen">
    <AppHeader />

    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <p class="text-gray-400 animate-pulse">Loading venues...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center">
      <p class="text-red-400">Failed to load: {{ error }}</p>
    </div>

    <!-- Main UI -->
    <div v-else class="flex flex-1 overflow-hidden">
      <aside class="w-80 border-r bg-gray-50 flex flex-col overflow-hidden">
        <FilterPanel :filters="filters" @update:filters="filters = $event" />
        <LocationList :locations="locations" @select="selected = $event" />
      </aside>
      <main class="flex-1 relative">
        <LocationMap
          :locations="locations"
          :selected="selected"
          @select="selected = $event"
        />
        <LocationDetail :location="selected" @close="selected = null" />
      </main>
    </div>

  </div>
</template>