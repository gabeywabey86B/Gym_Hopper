<script setup>
defineProps({
  filters: Object,
})

defineEmits(['update:filters'])

const facilityOptions = [
  'Gymnasium',
  'Swimming Pool',
  'Stadium',
  'Track',
  'Tennis Court',
  'Basketball Court',
  'Badminton Court',
]

function updateFilter(key, value) {
  emit('update:filters', { ...props.filters, [key]: value })
}
</script>

<template>
  <div class="p-4 border-b bg-white">
    <h2 class="font-semibold text-gray-700 mb-3">Filters</h2>

    <!-- Facility Type -->
    <div class="mb-4">
      <label class="text-xs text-gray-500 uppercase tracking-wide">Facility Type</label>
      <select
        class="mt-1 w-full border rounded px-2 py-1.5 text-sm text-gray-700"
        :value="filters.facilityType"
        @change="$emit('update:filters', { ...filters, facilityType: $event.target.value })"
      >
        <option value="">All Types</option>
        <option v-for="option in facilityOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <!-- Max Budget -->
    <div class="mb-4">
      <label class="text-xs text-gray-500 uppercase tracking-wide">
        Max Day Pass Price: ${{ filters.maxPrice ?? 'Any' }}
      </label>
      <input
        type="range"
        min="0"
        max="50"
        step="0.5"
        class="w-full mt-1"
        :value="filters.maxPrice ?? 50"
        @input="$emit('update:filters', { ...filters, maxPrice: Number($event.target.value) })"
      />
      <div class="flex justify-between text-xs text-gray-400">
        <span>$0</span>
        <span>$50</span>
      </div>
    </div>

    <!-- Free Only -->
    <div class="mb-4 flex items-center gap-2">
      <input
        type="checkbox"
        id="freeOnly"
        :checked="filters.freeOnly"
        @change="$emit('update:filters', { ...filters, freeOnly: $event.target.checked })"
        class="accent-blue-500"
      />
      <label for="freeOnly" class="text-sm text-gray-700">Free only</label>
    </div>

    <!-- Near Me -->
    <div class="mb-4 flex items-center gap-2">
      <input
        type="checkbox"
        id="nearMe"
        :checked="filters.nearMe"
        @change="$emit('update:filters', { ...filters, nearMe: $event.target.checked })"
        class="accent-blue-500"
      />
      <label for="nearMe" class="text-sm text-gray-700">Near me</label>
    </div>

    <!-- Clear Filters -->
    <button
      class="w-full text-sm text-blue-600 border border-blue-300 rounded px-3 py-1.5 hover:bg-blue-50 transition"
      @click="$emit('update:filters', { facilityType: '', maxPrice: null, freeOnly: false, nearMe: false })"
    >
      Clear Filters
    </button>
  </div>
</template>