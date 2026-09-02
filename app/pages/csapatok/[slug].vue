<script setup lang="ts">
import { applyJerseyNumberOverrides } from '~~/shared/jerseyNumbers'
import { getTeamBySlug, teamDefinitions } from '~~/shared/teams'
import type { TeamDataResponse } from '~~/shared/types/match'

const route = useRoute()
const slug = String(route.params.slug || '')
const team = getTeamBySlug(slug)

if (!team) {
  throw createError({ statusCode: 404, statusMessage: 'A keresett csapat nem található.' })
}

const { data: teams } = await useAsyncData('team-profiles', () => queryCollection('teams').first())
const { data: club } = await useAsyncData('team-club', () => queryCollection('club').first())
const { data: teamData, error: teamDataError } = await useFetch<TeamDataResponse>(`/api/teams/${team.slug}/matches`, {
  key: `team-data-${team.slug}`,
})

const teamProfile = computed(() => teams.value?.teams.find(profile => profile.id === team.id))
const training = computed(() => teamProfile.value?.training || [])
const jerseyNumberFiles = import.meta.glob<string>('../../../content/data/mezszamok.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})
const jerseyNumberSource = Object.values(jerseyNumberFiles)[0]
const players = computed(() => applyJerseyNumberOverrides(
    teamData.value?.players || [],
    team.id,
    jerseyNumberSource,
    teamDefinitions.length,
))
const playerColumns = computed(() => {
  const splitIndex = Math.ceil(players.value.length / 2)
  return [players.value.slice(0, splitIndex), players.value.slice(splitIndex)].filter(column => column.length)
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
          <div v-if="training.length" class="team-page-hero__training"><dt>Edzések</dt><dd><span v-for="time in training" :key="time">{{ time }}</span></dd></div>
          <div v-if="club?.venue.name" class="team-page-hero__venue"><dt>Helyszín</dt><dd>{{ club.venue.name }}</dd></div>
        </dl>
      </div>
    </section>

    <section class="section team-matches" aria-label="Mérkőzések">
      <div class="container">


        <p v-if="teamData?.stale" class="data-notice" role="status">
          <Icon name="lucide:triangle-alert" aria-hidden="true" />
          Az adatfrissítés átmenetileg nem érhető el, ezért az utolsó sikeres adatot mutatjuk.
        </p>

        <div v-if="teamDataError" class="matches-error" role="status">
          <Icon name="lucide:cloud-off" aria-hidden="true" />
          Az MLSZ meccsadatai átmenetileg nem érhetők el. Kérjük, próbáld meg később.
        </div>

        <div v-else class="team-matches__grid">
          <section class="team-matches__group" aria-labelledby="last-match-heading">
            <h2 id="last-match-heading">Utolsó eredmény</h2>
            <MatchesMatchCard v-if="teamData?.lastMatch" :match="teamData.lastMatch" />
            <p v-else class="match-empty">Ehhez a csapathoz még nincs lezárt mérkőzés az MLSZ Adatbankban.</p>
          </section>

          <section class="team-matches__group" aria-labelledby="next-match-heading">
            <h2 id="next-match-heading">Következő mérkőzés</h2>
            <MatchesMatchCard v-if="teamData?.nextMatch" :match="teamData.nextMatch" featured />
            <p v-else class="match-empty">Jelenleg nincs következő, időponttal rögzített mérkőzés az MLSZ Adatbankban.</p>
          </section>
        </div>

        <header class="team-matches__header">
          <div class="team-matches__source">
            <p>A meccsadatok az MLSZ Adatbankból érkeznek, és óránként frissülnek.</p>
            <a class="team-source-link" :href="team.sourceUrl" target="_blank" rel="noreferrer">
              Teljes sorsolás az MLSZ Adatbankban <Icon name="lucide:arrow-up-right" aria-hidden="true" />
            </a>
          </div>
        </header>

      </div>
    </section>

    <template v-if="teamProfile?.staff.length">
      <section class="section adult-staff">
        <div class="container">
          <p class="eyebrow">Staff</p>
          <div class="staff-list">
            <article v-for="member in teamProfile.staff" :key="member.name"><Icon name="lucide:user-round" aria-hidden="true" /><h3>{{ member.name }}</h3><p>{{ member.role }}</p></article>
          </div>
        </div>
      </section>

    </template>

    <section class="section section--surface squad-section" aria-labelledby="squad-heading">
      <div class="container">
        <UiSectionHeading id="squad-heading" eyebrow="Játékoskeret" title="A csapat névsora" intro="A játékoskeret az MLSZ Adatbankból érkezik, és óránként frissül." align="split" />

        <p v-if="teamData?.stale" class="data-notice" role="status">
          <Icon name="lucide:triangle-alert" aria-hidden="true" />
          Az adatfrissítés átmenetileg nem érhető el, ezért az utolsó sikeres játékoskeretet mutatjuk.
        </p>

        <div v-if="teamDataError" class="matches-error" role="status">
          <Icon name="lucide:cloud-off" aria-hidden="true" />
          Az MLSZ játékosadatai átmenetileg nem érhetők el. Kérjük, próbáld meg később.
        </div>

        <div v-else-if="players.length" class="player-list">
          <div v-for="(column, columnIndex) in playerColumns" :key="columnIndex" class="player-list__column">
            <article v-for="player in column" :key="player.sourceUrl">
              <strong class="numeric">{{ player.number === null ? '?' : String(player.number).padStart(2, '0') }}</strong>
              <a :href="player.sourceUrl" :aria-label="`${player.name} MLSZ-adatlapja, új lapon nyílik meg`" target="_blank" rel="noreferrer">
                {{ player.name }} <Icon name="lucide:arrow-up-right" aria-hidden="true" />
              </a>
              <span class="player-list__age">{{ player.age === null ? 'Életkor nem elérhető' : `${player.age} éves` }}</span>
            </article>
          </div>
        </div>

        <p v-else class="match-empty">Az MLSZ Adatbank jelenleg nem közöl játékoskeretet ehhez a csapathoz.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.team-page-hero{padding-block:calc(clamp(4rem,9vw,8rem) * .8);border-bottom:1px solid var(--color-line)}.team-page-hero__grid{display:grid;grid-template-columns:minmax(0,4fr) minmax(16rem,1fr);align-items:end;gap:var(--space-12)}.team-page-hero__copy{max-width:80%}.team-page-hero h1{max-width:calc(11ch * .8)}.team-page-hero__copy>p:last-child{max-width:44rem;margin-top:var(--space-8);color:var(--color-muted);font-size:clamp(1.05rem,1rem + .35vw,1.3rem);font-weight:700}.team-page-hero__details{display:grid;align-self:stretch;justify-self:end;width:min(100%,34rem);grid-template-rows:auto 1fr;gap:var(--space-4);margin:0;text-align:right}.team-page-hero__details div{display:grid;gap:var(--space-1);min-width:0}.team-page-hero__details dt{color:var(--color-muted);font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.team-page-hero__details dd{margin:0;font-weight:700}.team-page-hero__training dd{display:grid;justify-items:end;gap:var(--space-2)}.team-page-hero__training span{white-space:nowrap}.team-page-hero__venue{align-self:end}.team-matches__header{display:grid;gap:var(--space-4);margin-top:var(--space-8)}.team-matches__header .eyebrow{margin-bottom:0}.team-matches__source{display:flex;align-items:center;justify-content:space-between;gap:var(--space-6);color:var(--color-muted);font-size:clamp(1rem,.95rem + .2vw,1.15rem);line-height:1.5}.team-matches__source p{margin:0}.team-matches__grid{display:grid;align-items:stretch;grid-template-columns:1fr 1fr;gap:var(--space-8)}.team-matches__group{display:grid;grid-template-rows:auto minmax(13rem,1fr);gap:var(--space-6)}.team-matches__group .eyebrow{margin-bottom:0}.team-matches__group h2{font-size:clamp(1.8rem,4vw,2.7rem)}.team-matches__group :deep(.match-card),.team-matches__group .match-empty{box-sizing:border-box;height:100%;margin-top:0}.data-notice,.matches-error,.match-empty{display:flex;align-items:flex-start;gap:var(--space-3);padding:var(--space-4);border:1px solid var(--color-line);border-radius:var(--radius-md);background:var(--color-surface);color:var(--color-muted);font-size:.9rem;font-weight:600}.data-notice{margin-bottom:var(--space-6);border-color:color-mix(in srgb,var(--color-accent) 60%,var(--color-line))}.data-notice svg{flex:0 0 auto;color:var(--color-accent)}.matches-error{color:var(--color-danger)}.matches-error svg{flex:0 0 auto}.match-empty{min-height:13rem;align-items:center;border-style:dashed}.team-source-link{display:inline-flex;min-height:44px;flex:0 0 auto;align-items:center;gap:var(--space-2);color:var(--color-brand);font-size:.9rem;font-weight:700}.team-source-link svg{width:1rem}.adult-staff>.container>.eyebrow{margin-bottom:var(--space-6);font-size:1rem}.staff-list{border-top:1px solid var(--color-line)}.staff-list article{display:grid;min-height:4rem;grid-template-columns:2rem minmax(0,1fr) auto;align-items:center;gap:var(--space-4);border-bottom:1px solid var(--color-line)}.staff-list svg{width:1rem;color:var(--color-brand)}.staff-list h3{font-family:var(--font-body);font-size:.9rem;line-height:1.4}.staff-list p{color:var(--color-muted);font-size:.82rem;font-weight:700}.squad-groups{display:grid;gap:var(--space-12)}.squad-groups>section{display:grid;grid-template-columns:minmax(10rem,.4fr) 1fr;gap:var(--space-6);padding-top:var(--space-6);border-top:1px solid var(--color-line)}.squad-groups h3{font-size:2.2rem}.player-list{display:grid;grid-template-columns:1fr 1fr;gap:0 var(--space-8)}.player-list div{display:flex;min-height:4rem;align-items:center;gap:var(--space-4);border-bottom:1px solid var(--color-line)}.player-list strong{width:2rem;color:var(--color-accent);font-size:1.3rem}.player-list span{font-size:.9rem;font-weight:700}@media(max-width:767px){.team-page-hero__grid,.team-matches__grid{grid-template-columns:1fr}.team-page-hero__copy{max-width:none}.team-page-hero__details{align-self:auto;justify-self:start;text-align:left}.team-page-hero__training dd{justify-items:start}.team-page-hero__venue{align-self:auto}.team-matches__header{margin-bottom:var(--space-6)}.team-matches__source{flex-direction:column;align-items:flex-start;gap:var(--space-2)}.team-matches__grid{gap:var(--space-12)}.staff-list article{grid-template-columns:2rem minmax(0,1fr) auto}.staff-list p{grid-column:auto}.squad-groups>section{grid-template-columns:1fr}.player-list{grid-template-columns:1fr}}
.player-list{grid-template-columns:1fr 1fr;border-top:1px solid var(--color-line)}.player-list .player-list__column{display:grid;min-width:0;min-height:0;align-content:start;gap:0;border:0}.player-list article{display:grid;min-height:4rem;grid-template-columns:2rem minmax(0,1fr) auto;align-items:center;gap:var(--space-4);border-bottom:1px solid var(--color-line)}.player-list strong{width:auto}.player-list a{display:inline-flex;min-height:44px;align-items:center;gap:var(--space-2);color:var(--color-brand);font-size:.9rem;font-weight:700;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:.18em}.player-list a:hover{color:var(--color-brand-strong)}.player-list a svg{width:1rem;flex:0 0 auto}.player-list__age{color:var(--color-muted);font-size:.82rem;font-weight:700;white-space:nowrap}@media(max-width:767px){.player-list{grid-template-columns:1fr}.player-list article{grid-template-columns:2rem minmax(0,1fr) auto}}
.adult-staff{
  padding-top:0;
}
</style>
