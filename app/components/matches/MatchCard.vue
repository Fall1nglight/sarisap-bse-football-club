<script setup lang="ts">
import type { Match } from '~~/shared/types/match'

const props = defineProps<{
  match: Match
  featured?: boolean
}>()

const result = computed(() => props.match.status === 'finished'
  ? `${props.match.homeScore ?? '–'} : ${props.match.awayScore ?? '–'}`
  : formatTime(props.match.date))
</script>

<template>
  <article class="match-card" :class="{ 'match-card--featured': featured }">
    <div class="match-card__top">
      <span>{{ match.competition }}</span>
    </div>
    <time :datetime="match.date" class="match-card__date">{{ formatDate(match.date) }}</time>
    <div class="match-card__teams">
      <span :class="{ 'match-card__team--compact': match.homeTeam.length > 14 }">{{ match.homeTeam }}</span>
      <strong class="numeric">{{ result }}</strong>
      <span :class="{ 'match-card__team--compact': match.awayTeam.length > 14 }">{{ match.awayTeam }}</span>
    </div>
    <div class="match-card__venue"><Icon name="lucide:map-pin" aria-hidden="true" /> {{ match.venue }}</div>
  </article>
</template>

<style scoped>
.match-card { position: relative; padding: clamp(1.5rem, 4vw, 2.5rem); border: 1px solid var(--color-line); border-radius: var(--radius-md); background: var(--color-surface); }
.match-card::before { position: absolute; top: -.5rem; left: 1.5rem; width: 3rem; height: 1rem; border: solid var(--color-accent); border-width: 1px 1px 0; content: ''; }
.match-card__top { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .5rem; color: var(--color-muted); font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.match-card__top span + span { color: var(--color-accent); }
.match-card__date { display: block; margin: 1.25rem 0 1rem; color: var(--color-muted); font-size: .8rem; font-weight: 600; }
.match-card__teams { display: grid; align-items: center; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); gap: 1rem; font-family: var(--font-display); font-size: clamp(1.25rem, 2.3vw, 1.75rem); font-weight: 700; line-height: 1.05; }
.match-card__teams span { min-width: 0; }
.match-card__teams .match-card__team--compact { overflow-wrap: anywhere; font-size: 1.15rem; hyphens: auto; line-height: 1.15; text-wrap: balance; }
.match-card__teams span:last-child { text-align: right; }
.match-card__teams strong { color: var(--color-brand); font-size: clamp(2rem, 5vw, 3.2rem); white-space: nowrap; }
.match-card__venue { display: flex; align-items: center; gap: .5rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--color-line); color: var(--color-muted); font-size: .78rem; font-weight: 600; }
.match-card__venue svg { width: 1rem; color: var(--color-brand); }
.match-card--featured { background: var(--color-brand-strong); color: var(--color-on-brand); }
.match-card--featured .match-card__teams strong, .match-card--featured .match-card__venue svg { color: #d4b36e; }
.match-card--featured .match-card__top, .match-card--featured .match-card__date, .match-card--featured .match-card__venue { color: color-mix(in srgb, var(--color-on-brand) 72%, transparent); }
.match-card--featured .match-card__venue { border-color: color-mix(in srgb, var(--color-on-brand) 22%, transparent); }
@media (max-width: 479px) { .match-card__teams { grid-template-columns: 1fr; text-align: left; } .match-card__teams span:last-child { text-align: left; } .match-card__teams .match-card__team--compact { overflow-wrap: normal; font-size: inherit; hyphens: none; } }
</style>
