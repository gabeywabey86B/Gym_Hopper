<script setup>
import { ref, watch } from 'vue'
import { LCircleMarker, LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'

const props = defineProps({
  locations: {
    type: Array,
    default: () => [],
  },
  selectedLocation: {
    type: Object,
    default: null,
  },
})

defineEmits(['select'])

const singaporeCenter = [1.3521, 103.8198]
const defaultZoom = 11
const selectedZoom = 13

const mapCenter = ref(singaporeCenter)
const mapZoom = ref(defaultZoom)

watch(() => props.selectedLocation, (location) => {
  if (location?.lat && location?.lng) {
    mapCenter.value = [location.lat, location.lng]
    mapZoom.value = selectedZoom
  }
}, { immediate: true })
</script>

<template>
  <div class="absolute inset-0 z-0 overflow-hidden">
    <LMap
      :center="mapCenter"
      :zoom="mapZoom"
      :use-global-leaflet="false"
      :zoom-control="false"
      class="h-full w-full"
    >
      <LTileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LCircleMarker
        v-for="location in locations"
        :key="location.id"
        :lat-lng="[location.lat, location.lng]"
        :radius="selectedLocation?.id === location.id ? 8 : 5"
        :color="selectedLocation?.id === location.id ? '#1d4ed8' : '#0f172a'"
        :fill-color="selectedLocation?.id === location.id ? '#3b82f6' : '#111827'"
        :fill-opacity="0.85"
        :weight="2"
        @click="$emit('select', location)"
      />
    </LMap>
  </div>
</template>
