<script setup>
defineProps({
  location: Object,
})
</script>

<template>
  <div class="bg-white rounded-lg border p-4 hover:shadow-md cursor-pointer transition">
    <h3 class="font-semibold text-gray-800 text-sm">{{ location.name }}</h3>

    <div class="flex flex-wrap gap-1 mt-2">
      <span
        v-for="type in location.facilityTypes"
        :key="type"
        class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
      >
        {{ type }}
      </span>
    </div>

    <div class="mt-2 text-xs text-gray-500 space-y-1">
      <p v-if="location.isFree" class="text-green-600 font-medium">Free</p>
      <p v-else-if="location.dayPassPrice">Day pass: ${{ location.dayPassPrice }}</p>
      <p v-if="location.membershipPrice">Membership: ${{ location.membershipPrice }}/yr</p>
    </div>
  </div>
</template>