<script setup>
import LocationCard from './LocationCard.vue'

defineProps({
  locations: Array,
})

defineEmits(['select'])
</script>

<template>
  <div class="flex flex-col gap-3 p-4 overflow-y-auto h-full">
    <p class="text-xs text-gray-400">{{ locations.length }} venues found</p>
    <LocationCard
      v-for="loc in locations"
      :key="loc.id"
      :location="loc"
      @click="$emit('select', loc)"
    />
  </div>
</template>