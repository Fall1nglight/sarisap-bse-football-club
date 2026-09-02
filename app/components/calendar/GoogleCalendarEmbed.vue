<script setup lang="ts">
const props = defineProps<{ calendarId: string }>()

const compactView = ref(false)
let compactQuery: MediaQueryList | undefined

const calendarUrl = computed(() => {
  const params = new URLSearchParams({
    src: props.calendarId,
    ctz: 'Europe/Budapest',
    hl: 'hu',
    mode: compactView.value ? 'AGENDA' : 'MONTH',
  })

  return `https://calendar.google.com/calendar/embed?${params.toString()}`
})

const calendarLink = computed(() => `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(props.calendarId)}`)

function updateCompactView() {
  compactView.value = compactQuery?.matches || false
}

onMounted(() => {
  compactQuery = window.matchMedia('(max-width: 767px)')
  updateCompactView()
  compactQuery.addEventListener('change', updateCompactView)
})

onBeforeUnmount(() => compactQuery?.removeEventListener('change', updateCompactView))
</script>

<template>
  <div class="calendar-embed">
    <iframe
      :key="calendarUrl"
      :src="calendarUrl"
      title="A Sárisápi BSE programnaptára"
      loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin"
    />
    <a class="calendar-embed__link" :href="calendarLink" target="_blank" rel="noopener noreferrer">
      Megnyitás a Google Naptárban <Icon name="lucide:arrow-up-right" aria-hidden="true" />
    </a>
  </div>
</template>

<style scoped>
.calendar-embed { overflow: hidden; border: 1px solid var(--color-line); border-radius: var(--radius-md); background: #fff; }
.calendar-embed iframe { display: block; width: 100%; height: 48rem; border: 0; }
.calendar-embed__link { display: inline-flex; min-height: 48px; align-items: center; gap: var(--space-2); padding: var(--space-3) var(--space-4); color: var(--color-brand); font-size: .88rem; font-weight: 700; }
.calendar-embed__link svg { width: 1rem; }
@media (max-width: 767px) { .calendar-embed iframe { height: 42rem; } }
</style>
