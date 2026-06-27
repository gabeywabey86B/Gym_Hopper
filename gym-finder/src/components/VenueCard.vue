<script setup>
defineProps({
  location: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select'])
</script>

<template>
  <button
    type="button"
    class="w-full rounded-xl border p-4 text-left transition"
    :class="selected
      ? 'border-blue-500 bg-blue-50 shadow-sm'
      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'"
    @click="$emit('select', location)"
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
</template>
