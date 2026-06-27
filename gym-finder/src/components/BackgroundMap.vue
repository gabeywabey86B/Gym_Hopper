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
const tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
const tileAttribution = '&copy; OpenStreetMap contributors &copy; CARTO'

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
      class="minimal-map h-full w-full"
    >
      <LTileLayer
        :attribution="tileAttribution"
        :url="tileUrl"
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

<style scoped>
:deep(.minimal-map) {
  background: #f5f5f2;
}

:deep(.minimal-map .leaflet-control-container) {
  display: none;
}

:deep(.minimal-map .leaflet-tile-pane) {
  filter: saturate(0.72) contrast(1.02) brightness(1.03);
  opacity: 0.92;
}

:deep(.minimal-map .leaflet-overlay-pane) {
  filter: saturate(0.9);
}

:deep(.minimal-map .leaflet-pane),
:deep(.minimal-map .leaflet-tile),
:deep(.minimal-map .leaflet-marker-icon),
:deep(.minimal-map .leaflet-marker-shadow) {
  transition: filter 180ms ease, opacity 180ms ease;
}
</style>
