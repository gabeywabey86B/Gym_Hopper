<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineEmits(['close'])

const props = defineProps({
  location: {
    type: Object,
    default: null,
  },
  hasResults: {
    type: Boolean,
    default: false,
  },
})

const scrollContainer = ref(null)
const showScrollButton = ref(false)

function updateScrollState() {
  const element = scrollContainer.value

  if (!element) {
    showScrollButton.value = false
    return
  }

  const remainingScroll = element.scrollHeight - element.scrollTop - element.clientHeight
  showScrollButton.value = remainingScroll > 24
}

function scrollDetailsDown() {
  const element = scrollContainer.value

  if (!element) return

  element.scrollBy({
    top: Math.max(element.clientHeight * 0.75, 240),
    behavior: 'smooth',
  })
}

watch(() => props.location, async () => {
  await nextTick()

  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0
  }

  updateScrollState()
}, { immediate: true })

onMounted(() => {
  window.addEventListener('resize', updateScrollState)
  updateScrollState()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollState)
})
</script>

<template>
  <section class="flex h-[calc(100vh-3rem)] min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
    <div v-if="location" class="flex min-h-0 flex-1 flex-col">
      <div class="border-b border-gray-100 px-6 pb-4 pt-6">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <h2 class="text-xl font-semibold text-gray-900">{{ location.name }}</h2>
            <p class="mt-1 text-sm text-gray-500">Postal code: {{ location.postalCode || 'N/A' }}</p>
          </div>

          <button
            type="button"
            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
            aria-label="Close venue details"
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

        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="facility in location.facilityTypes"
            :key="facility.type"
            class="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
          >
            {{ facility.type }}
          </span>
        </div>
      </div>

      <div class="relative min-h-0 flex-1">
        <div
          ref="scrollContainer"
          class="h-full overflow-y-auto p-6"
          @scroll="updateScrollState"
        >
          <div class="space-y-4">
            <section
              v-for="facility in location.facilityTypes"
              :key="facility.type"
              class="rounded-xl border border-gray-200 p-4"
            >
              <h3 class="text-sm font-medium text-gray-900">{{ facility.type }}</h3>

              <div class="mt-3 space-y-1 text-sm text-gray-600">
                <p>Free: <span class="font-medium text-gray-800">{{ facility.isFree ? 'Yes' : 'No' }}</span></p>
                <p>
                  Day pass:
                  <span class="font-medium text-gray-800">
                    {{ facility.dayPassPrice !== null ? `$${facility.dayPassPrice}` : 'No pricing info' }}
                  </span>
                </p>
                <p>
                  Membership:
                  <span class="font-medium text-gray-800">
                    {{ facility.membershipPrice !== null ? `$${facility.membershipPrice}/yr` : 'No pricing info' }}
                  </span>
                </p>
              </div>

              <div class="mt-4">
                <p class="mb-2 text-xs uppercase tracking-wide text-gray-400">Equipment</p>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="item in facility.equipment?.length ? facility.equipment : ['No equipment listed']"
                    :key="item"
                    class="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>

              <div class="mt-4">
                <p class="mb-2 text-xs uppercase tracking-wide text-gray-400">Amenities</p>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="item in facility.amenities?.length ? facility.amenities : ['No amenities listed']"
                    :key="item"
                    class="rounded bg-green-50 px-2 py-0.5 text-xs text-green-700"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div
          v-if="showScrollButton"
          class="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-6 pb-4"
        >
          <button
            type="button"
            class="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-white"
            aria-label="Scroll venue details down"
            @click="scrollDetailsDown"
          >
            <span>More details</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              class="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
            >
              <path d="M10 4v12" />
              <path d="M5 11l5 5 5-5" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="hasResults" class="flex flex-1 items-center justify-center p-6">
      <div class="max-w-sm text-center">
        <h2 class="text-lg font-medium text-gray-900">Select a venue</h2>
        <p class="mt-2 text-sm text-gray-500">
          Choose a search result to inspect facility types, equipment, amenities, and pricing.
        </p>
      </div>
    </div>

    <div v-else class="flex flex-1 items-center justify-center p-6">
      <div class="max-w-sm text-center">
        <h2 class="text-lg font-medium text-gray-900">No venue selected</h2>
        <p class="mt-2 text-sm text-gray-500">
          Details will appear here when a matching venue is selected.
        </p>
      </div>
    </div>
  </section>
</template>
