<script setup>
const props = defineProps({
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
        v-for="facility in location.facilityTypes"
        :key="facility.type"
        class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
      >
        {{ facility.type }}
      </span>
    </div>

    <div class="mt-4 space-y-4">
      <section
        v-for="facility in props.location.facilityTypes"
        :key="facility.type"
        class="border rounded-lg p-3"
      >
        <h3 class="font-medium text-sm text-gray-800">{{ facility.type }}</h3>

        <div class="mt-2 text-sm text-gray-600 space-y-1">
          <p v-if="facility.isFree" class="text-green-600 font-medium">✓ Free entry</p>
          <p v-if="facility.dayPassPrice !== null">Day pass: <strong>${{ facility.dayPassPrice }}</strong></p>
          <p v-if="facility.membershipPrice !== null">Membership: <strong>${{ facility.membershipPrice }}/yr</strong></p>
          <p
            v-if="!facility.isFree && facility.dayPassPrice === null && facility.membershipPrice === null"
            class="text-gray-400"
          >
            No pricing info available
          </p>
        </div>

        <div v-if="facility.equipment?.length" class="mt-3">
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Equipment</p>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="item in facility.equipment"
              :key="item"
              class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
            >
              {{ item }}
            </span>
          </div>
        </div>

        <div v-if="facility.amenities?.length" class="mt-3">
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Amenities</p>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="item in facility.amenities"
              :key="item"
              class="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
