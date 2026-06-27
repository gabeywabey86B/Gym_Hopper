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

defineEmits(['select', 'close'])
</script>

<template>
  <div
    class="w-full rounded-xl border p-4 transition"
    :class="selected
      ? 'border-blue-500 bg-blue-50 shadow-sm'
      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'"
  >
    <div class="flex items-start justify-between gap-3">
      <button
        type="button"
        class="min-w-0 flex-1 text-left"
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

      <button
        v-if="selected"
        type="button"
        class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
        aria-label="Close venue card"
        @click="$emit('close')"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.8"
        >
          <path d="M5 5l10 10" />
          <path d="M15 5L5 15" />
        </svg>
      </button>
    </div>
  </div>
</template>
