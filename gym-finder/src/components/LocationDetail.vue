<script setup>
defineProps({
  location: Object,
})

defineEmits(['close'])
</script>

<template>
  <div
    v-if="location"
    class="absolute bottom-4 right-4 w-80 bg-white rounded-xl shadow-xl p-5 z-50"
  >
    <!-- Close button -->
    <button
      class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
      @click="$emit('close')"
    >
      ✕
    </button>

    <h2 class="font-bold text-gray-800 text-base pr-6">{{ location.name }}</h2>

    <!-- Facility type badges -->
    <div class="flex flex-wrap gap-1 mt-2">
      <span
        v-for="type in location.facilityTypes"
        :key="type"
        class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
      >
        {{ type }}
      </span>
    </div>

    <!-- Pricing -->
    <div class="mt-3 text-sm text-gray-600 space-y-1">
      <p v-if="location.isFree" class="text-green-600 font-medium">✓ Free entry</p>
      <p v-else-if="location.dayPassPrice">Day pass: <strong>${{ location.dayPassPrice }}</strong></p>
      <p v-if="location.membershipPrice">Membership: <strong>${{ location.membershipPrice }}/yr</strong></p>
      <p v-if="!location.isFree && !location.dayPassPrice && !location.membershipPrice" class="text-gray-400">
        No pricing info available
      </p>
    </div>

    <!-- Equipment -->
    <div v-if="location.equipment?.length" class="mt-3">
      <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Equipment</p>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="item in location.equipment"
          :key="item"
          class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
        >
          {{ item }}
        </span>
      </div>
    </div>

    <!-- Facilities -->
    <div v-if="location.facilities?.length" class="mt-3">
      <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Facilities</p>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="item in location.facilities"
          :key="item"
          class="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded"
        >
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>