<script setup lang="ts">
const { data } = await useAsyncData('matches-page', () => queryCollection('matches').first())
const upcoming = computed(() => data.value?.matches.filter(match => match.status === 'upcoming') || [])
const finished = computed(() => data.value?.matches.filter(match => match.status === 'finished') || [])
const config = useRuntimeConfig()

useSiteSeo({ title: 'Mérkőzések', description: 'A Sárisápi BSE következő mérkőzései, legutóbbi eredményei és aktuális bajnoki tabellája.' })
useJsonLd(computed(() => upcoming.value.map(match => ({
  '@context': 'https://schema.org', '@type': 'SportsEvent', name: `${match.homeTeam} – ${match.awayTeam}`,
  startDate: match.date, eventStatus: 'https://schema.org/EventScheduled',
  location: { '@type': 'Place', name: match.venue },
  homeTeam: { '@type': 'SportsTeam', name: match.homeTeam }, awayTeam: { '@type': 'SportsTeam', name: match.awayTeam },
  url: new URL('/merkozesek', config.public.siteUrl).toString(),
}))).value)
</script>

<template>
  <div>
    <section class="section">
      <div class="container"><UiSectionHeading eyebrow="Következő mérkőzések" title="Találkozzunk a pályán!" /><div class="match-grid"><MatchesMatchCard v-for="(match,index) in upcoming" :key="match.id" :match="match" :featured="index===0" data-reveal /></div></div>
    </section>
    <section class="section section--surface">
      <div class="container"><UiSectionHeading eyebrow="Lezárt találkozók" title="Legutóbbi eredmények" />
        <div class="results-list"><MatchesMatchCard v-for="match in finished" :key="match.id" :match="match" data-reveal /></div>
      </div>
    </section>
    <section class="section standings-section">
      <div class="container"><UiSectionHeading eyebrow="Bajnoki állás" title="Aktuális tabella" intro="Kövesd nyomon a csapatok helyezését, eredményeit és a bajnokság alakulását fordulóról fordulóra." align="split" />
        <div class="table-scroll" role="region" aria-label="Vármegyei bajnokság tabellája" tabindex="0">
          <table><thead><tr><th scope="col">#</th><th scope="col">Csapat</th><th scope="col">M</th><th scope="col">GY</th><th scope="col">D</th><th scope="col">V</th><th scope="col">GK</th><th scope="col">P</th></tr></thead>
            <tbody><tr v-for="row in data?.standings" :key="row.team" :class="{highlight:row.team==='Sárisápi BSE'}"><td class="numeric">{{ row.position }}</td><th scope="row">{{ row.team }}</th><td>{{ row.played }}</td><td>{{ row.won }}</td><td>{{ row.drawn }}</td><td>{{ row.lost }}</td><td>{{ row.goalDifference>0?`+${row.goalDifference}`:row.goalDifference }}</td><td class="numeric points">{{ row.points }}</td></tr></tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.match-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem}.results-list{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}.table-scroll{overflow-x:auto;border:1px solid var(--color-line);border-radius:var(--radius-md)}table{width:100%;min-width:44rem;border-collapse:collapse;background:var(--color-surface)}th,td{height:4.25rem;padding:.75rem 1rem;border-bottom:1px solid var(--color-line);text-align:right;font-size:.82rem;font-variant-numeric:tabular-nums}th:nth-child(2),td:nth-child(2){text-align:left}thead th{height:3.25rem;color:var(--color-muted);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase}tbody th{font-weight:700}.points{color:var(--color-brand);font-size:1.15rem;font-weight:700}.highlight{background:color-mix(in srgb,var(--color-brand) 10%,var(--color-surface))}.highlight th{color:var(--color-brand)}@media(max-width:900px){.results-list{grid-template-columns:1fr 1fr}}@media(max-width:767px){.match-grid,.results-list{grid-template-columns:1fr}}
</style>
