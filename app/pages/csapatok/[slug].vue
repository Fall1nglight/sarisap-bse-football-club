<script setup lang="ts">
import { applyJerseyNumberOverrides } from '~~/shared/jerseyNumbers'
import { getTeamBySlug, teamDefinitions } from '~~/shared/teams'
import type { TeamMatchesResponse } from '~~/shared/types/match'

const route = useRoute()
const slug = String(route.params.slug || '')
const team = getTeamBySlug(slug)

if (!team) {
  throw createError({ statusCode: 404, statusMessage: 'A keresett csapat nem található.' })
}

const { data: teams } = await useAsyncData('team-profiles', () => queryCollection('teams').first())
const { data: club } = await useAsyncData('team-club', () => queryCollection('club').first())
const { data: teamMatches, error: matchesError } = await useFetch<TeamMatchesResponse>(`/api/teams/${team.slug}/matches`, {
  key: `team-matches-${team.slug}`,
})

const youth = computed(() => team.profile === 'youth'
  ? teams.value?.youth.find(group => group.ageGroup === team.ageGroup)
  : undefined)
const adult = computed(() => team.profile === 'adult' ? teams.value?.adult : undefined)
const training = computed(() => youth.value?.training || adult.value?.training || [])
const teamIndex = teamDefinitions.findIndex(definition => definition.slug === team.slug)
const jerseyNumberFiles = import.meta.glob<string>('../../../content/data/mezszamok.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})
const jerseyNumberSource = Object.values(jerseyNumberFiles)[0]
const positions = ['Kapus', 'Védő', 'Középpályás', 'Támadó']
const groupedPlayers = computed(() => {
  const players = applyJerseyNumberOverrides(
    adult.value?.players || [],
    teamIndex,
    jerseyNumberSource,
    teamDefinitions.length,
  )

  return positions.map(position => ({
    position,
    players: players.filter(player => player.position === position),
  }))
})

useSiteSeo({
  title: team.name,
  description: `${team.name} legutóbbi eredménye, következő mérkőzése és csapatinformációi a ${team.competition} bajnokságban.`,
  image: team.profile === 'adult' ? '/images/club/csapatkor.png' : '/images/club/utanpotlas-edzes.png',
})
useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'SportsTeam',
  name: team.name,
  sport: 'Labdarúgás',
  memberOf: { '@type': 'SportsOrganization', name: 'Sárisápi BSE' },
})
</script>

<template>
  <div>
    <div class="container">
      <UiBreadcrumbs :items="[{ label: 'Főoldal', to: '/' }, { label: 'Csapatok', to: '/csapatok' }, { label: team.name }]" />
    </div>

    <section class="team-page-hero section--surface">
      <div class="container team-page-hero__grid">
        <div class="team-page-hero__copy">
          <p class="eyebrow">Csapat</p>
          <h1>{{ team.name }}</h1>
          <p>{{ team.competition }}</p>
        </div>
        <dl class="team-page-hero__details">
          <div v-if="club?.venue.name"><dt>Helyszín</dt><dd>{{ club.venue.name }}</dd></div>
          <div v-if="training.length" class="team-page-hero__training"><dt>Edzések</dt><dd><span v-for="time in training" :key="time">{{ time }}</span></dd></div>
        </dl>
      </div>
    </section>

    <section class="section team-matches" aria-labelledby="matches-heading">
      <div class="container">
        <UiSectionHeading id="matches-heading" eyebrow="Mérkőzések" title="A pályán" intro="A meccsadatok az MLSZ Adatbankból érkeznek, és óránként frissülnek." align="split" />

        <p v-if="teamMatches?.stale" class="data-notice" role="status">
          <Icon name="lucide:triangle-alert" aria-hidden="true" />
          Az adatfrissítés átmenetileg nem érhető el, ezért az utolsó sikeres adatot mutatjuk.
        </p>

        <div v-if="matchesError" class="matches-error" role="status">
          <Icon name="lucide:cloud-off" aria-hidden="true" />
          Az MLSZ meccsadatai átmenetileg nem érhetők el. Kérjük, próbáld meg később.
        </div>

        <div v-else class="team-matches__grid">
          <section class="team-matches__group" aria-labelledby="last-match-heading">
            <p class="eyebrow">Legutóbbi mérkőzés</p>
            <h2 id="last-match-heading">Utolsó eredmény</h2>
            <MatchesMatchCard v-if="teamMatches?.lastMatch" :match="teamMatches.lastMatch" />
            <p v-else class="match-empty">Ehhez a csapathoz még nincs lezárt mérkőzés az MLSZ Adatbankban.</p>
          </section>

          <section class="team-matches__group" aria-labelledby="next-match-heading">
            <p class="eyebrow">Következő mérkőzés</p>
            <h2 id="next-match-heading">Találkozzunk a pályán</h2>
            <MatchesMatchCard v-if="teamMatches?.nextMatch" :match="teamMatches.nextMatch" featured />
            <p v-else class="match-empty">Jelenleg nincs következő, időponttal rögzített mérkőzés az MLSZ Adatbankban.</p>
          </section>
        </div>

        <a class="team-source-link" :href="team.sourceUrl" target="_blank" rel="noreferrer">
          Teljes sorsolás az MLSZ Adatbankban <Icon name="lucide:arrow-up-right" aria-hidden="true" />
        </a>
      </div>
    </section>

    <template v-if="adult">
      <section class="section adult-staff">
        <div class="container">
          <UiSectionHeading eyebrow="Szakmai stáb" title="Akik vezetik a munkát" />
          <div class="staff-list">
            <article v-for="member in adult.staff" :key="member.name"><Icon name="lucide:user-round" aria-hidden="true" /><h3>{{ member.name }}</h3><p>{{ member.role }}</p></article>
          </div>
        </div>
      </section>

      <section class="section section--surface squad-section">
        <div class="container">
          <UiSectionHeading eyebrow="Játékoskeret" title="A csapat névsora" intro="Ismerd meg a csapat játékosait posztonként, mezszámokkal rendezve." align="split" />
          <div class="squad-groups">
            <section v-for="group in groupedPlayers" :key="group.position">
              <h3>{{ group.position }}</h3>
              <div class="player-list"><div v-for="player in group.players" :key="`${player.name}-${player.number}`"><strong class="numeric">{{ String(player.number).padStart(2, '0') }}</strong><span>{{ player.name }}</span></div></div>
            </section>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.team-page-hero{padding-block:calc(clamp(4rem,9vw,8rem) * .8);border-bottom:1px solid var(--color-line)}.team-page-hero__grid{display:grid;grid-template-columns:minmax(0,4fr) minmax(16rem,1fr);align-items:end;gap:var(--space-12)}.team-page-hero__copy{max-width:80%}.team-page-hero h1{max-width:calc(11ch * .8)}.team-page-hero__copy>p:last-child{max-width:44rem;margin-top:var(--space-8);color:var(--color-muted);font-size:clamp(1.05rem,1rem + .35vw,1.3rem);font-weight:700}.team-page-hero__details{display:grid;justify-self:end;width:min(100%,34rem);grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space-4) var(--space-8);margin:0;text-align:right}.team-page-hero__details div{display:grid;gap:var(--space-1);min-width:0}.team-page-hero__details dt{color:var(--color-muted);font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.team-page-hero__details dd{margin:0;font-weight:700}.team-page-hero__training dd{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:var(--space-2) var(--space-4)}.team-page-hero__training span+span{padding-left:var(--space-4);border-left:1px solid var(--color-line)}.team-matches__grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-8)}.team-matches__group{display:grid;align-content:start;gap:var(--space-4)}.team-matches__group .eyebrow{margin-bottom:0}.team-matches__group h2{font-size:clamp(1.8rem,4vw,2.7rem)}.team-matches__group :deep(.match-card){margin-top:var(--space-4)}.data-notice,.matches-error,.match-empty{display:flex;align-items:flex-start;gap:var(--space-3);padding:var(--space-4);border:1px solid var(--color-line);border-radius:var(--radius-md);background:var(--color-surface);color:var(--color-muted);font-size:.9rem;font-weight:600}.data-notice{margin-bottom:var(--space-6);border-color:color-mix(in srgb,var(--color-accent) 60%,var(--color-line))}.data-notice svg{flex:0 0 auto;color:var(--color-accent)}.matches-error{color:var(--color-danger)}.matches-error svg{flex:0 0 auto}.match-empty{min-height:13rem;align-items:center;border-style:dashed}.team-source-link{display:inline-flex;min-height:44px;align-items:center;gap:var(--space-2);margin-top:var(--space-8);color:var(--color-brand);font-size:.9rem;font-weight:700}.team-source-link svg{width:1rem}.staff-list{border-top:1px solid var(--color-line)}.staff-list article{display:grid;min-height:5.5rem;grid-template-columns:3rem minmax(0,1fr) auto;align-items:center;gap:var(--space-4);border-bottom:1px solid var(--color-line)}.staff-list svg{width:1.4rem;color:var(--color-brand)}.staff-list h3{font-family:var(--font-body);font-size:1rem;line-height:1.4}.staff-list p{color:var(--color-muted);font-size:.82rem;font-weight:700}.squad-groups{display:grid;gap:var(--space-12)}.squad-groups>section{display:grid;grid-template-columns:minmax(10rem,.4fr) 1fr;gap:var(--space-6);padding-top:var(--space-6);border-top:1px solid var(--color-line)}.squad-groups h3{font-size:2.2rem}.player-list{display:grid;grid-template-columns:1fr 1fr;gap:0 var(--space-8)}.player-list div{display:flex;min-height:4rem;align-items:center;gap:var(--space-4);border-bottom:1px solid var(--color-line)}.player-list strong{width:2rem;color:var(--color-accent);font-size:1.3rem}.player-list span{font-size:.9rem;font-weight:700}@media(max-width:767px){.team-page-hero__grid,.team-matches__grid{grid-template-columns:1fr}.team-page-hero__copy{max-width:none}.team-page-hero__details{justify-self:start;grid-template-columns:1fr;text-align:left}.team-page-hero__training dd{justify-content:flex-start}.team-matches__grid{gap:var(--space-12)}.staff-list article{grid-template-columns:2rem 1fr}.staff-list p{grid-column:2}.squad-groups>section{grid-template-columns:1fr}.player-list{grid-template-columns:1fr}}
</style>
