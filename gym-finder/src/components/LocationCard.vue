<script setup>
import { computed } from 'vue'

const props = defineProps({
  location: Object,
})

const cheapestDayPass = computed(() => {
  const prices = props.location.facilityTypes
    .map(facility => facility.dayPassPrice)
    .filter(price => price !== null)

  return prices.length ? Math.min(...prices) : null
})

const cheapestMembership = computed(() => {
  const prices = props.location.facilityTypes
    .map(facility => facility.membershipPrice)
    .filter(price => price !== null)

  return prices.length ? Math.min(...prices) : null
})

const hasFreeFacility = computed(() => props.location.facilityTypes.some(facility => facility.isFree))
</script>

<template>
  <div class="bg-white rounded-lg border p-4 hover:shadow-md cursor-pointer transition">
    <h3 class="font-semibold text-gray-800 text-sm">{{ location.name }}</h3>

    <div class="flex flex-wrap gap-1 mt-2">
      <span
        v-for="facility in location.facilityTypes"
        :key="facility.type"
        class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
      >
        {{ facility.type }}
      </span>
    </div>

    <div class="mt-2 text-xs text-gray-500 space-y-1">
      <p v-if="hasFreeFacility" class="text-green-600 font-medium">Free options available</p>
      <p v-if="cheapestDayPass !== null">Day pass from ${{ cheapestDayPass }}</p>
      <p v-if="cheapestMembership !== null">Membership from ${{ cheapestMembership }}/yr</p>
    </div>
  </div>
</template>
