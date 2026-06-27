<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: 'App',
  },
  query: {
    type: String,
    default: '',
  },
})

defineEmits(['toggle', 'search', 'update:query'])
</script>

<template>
  <aside
    class="flex shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-200"
    :class="isOpen ? 'w-72' : 'w-20'"
  >
    <div class="flex items-start justify-between gap-3 border-b border-gray-200 p-4">
      <div v-if="isOpen" class="min-w-0">
        <h1 class="truncate text-lg font-semibold text-gray-900">{{ title }}</h1>
      </div>

      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
        :aria-label="isOpen ? 'Collapse sidebar' : 'Expand sidebar'"
        @click="$emit('toggle')"
      >
        <span class="relative block h-4 w-4" aria-hidden="true">
          <span class="absolute left-0 top-0 block h-0.5 w-4 rounded-full bg-current" />
          <span class="absolute left-0 top-[0.4375rem] block h-0.5 w-4 rounded-full bg-current" />
          <span class="absolute left-0 top-[0.875rem] block h-0.5 w-4 rounded-full bg-current" />
        </span>
      </button>
    </div>

    <nav class="p-3">
      <label
        v-if="isOpen"
        class="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-800 transition focus-within:border-gray-300 focus-within:bg-white"
      >
        <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-gray-700">
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
            <circle cx="8.5" cy="8.5" r="4.5" />
            <path d="M12 12l4 4" />
          </svg>
        </span>
        <input
          :value="query"
          type="search"
          placeholder="Search venues or facility types"
          class="w-full border-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          @focus="$emit('search')"
          @input="$emit('update:query', $event.target.value)"
        >
      </label>

      <button
        v-else
        type="button"
        class="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-left text-sm font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-100"
        @click="$emit('search')"
      >
        <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-gray-700">
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
            <circle cx="8.5" cy="8.5" r="4.5" />
            <path d="M12 12l4 4" />
          </svg>
        </span>
      </button>
    </nav>
  </aside>
</template>
