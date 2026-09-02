<script setup lang="ts">
const config = useRuntimeConfig()
const calendarId = config.public.googleCalendarId

useSiteSeo({
  title: 'Naptár',
  description: 'A Sárisápi BSE edzései, mérkőzései és klubprogramjai egy helyen.',
})
</script>

<template>
  <div>
    <UiPageHero
      eyebrow="Programok"
      title="Naptár"
      intro="Itt találod a Sárisápi BSE edzéseit, mérkőzéseit és további klubprogramjait. A mérkőzések az MLSZ Adatbankból frissülnek."
    />

    <section class="section calendar-section" aria-labelledby="calendar-heading">
      <div class="container">
        <UiSectionHeading
          id="calendar-heading"
          eyebrow="Klubélet"
          title="Mikor találkozunk?"
          intro="A naptár eseményeit megtekintheted itt, vagy megnyithatod közvetlenül a Google Naptárban."
          align="split"
        />
        <CalendarGoogleCalendarEmbed v-if="calendarId" :calendar-id="calendarId" />
        <p v-else class="calendar-unavailable" role="status">
          A programnaptár beállítása folyamatban van. Kérjük, nézz vissza később.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.calendar-section { background: var(--color-surface); }
.calendar-unavailable { max-width: 42rem; padding: var(--space-6); border: 1px dashed var(--color-line); color: var(--color-muted); font-weight: 600; }
</style>
