<script setup>
import { LMap, LTileLayer, LMarker, LTooltip } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

defineProps({
  locations: Array,
  selected: Object,
})

defineEmits(['select'])
</script>

<template>
  <LMap
    :zoom="12"
    :center="[1.3521, 103.8198]"
    class="w-full h-full z-0"
  >
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="© OpenStreetMap contributors"
    />
    <LMarker
      v-for="loc in locations"
      :key="loc.id"
      :lat-lng="[loc.lat, loc.lng]"
      @click="$emit('select', loc)"
    >
      <LTooltip>{{ loc.name }}</LTooltip>
    </LMarker>
  </LMap>
</template>