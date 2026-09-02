<script setup lang="ts">
import { teamDefinitions } from '~~/shared/teams'

useSiteSeo({ title: 'Csapatok', description: 'Ismerd meg a Sárisápi BSE csapatait, valamint a legutóbbi és következő mérkőzéseiket.' })
</script>

<template>
  <div>
    <div class="container">
      <UiBreadcrumbs :items="[{ label: 'Főoldal', to: '/' }, { label: 'Csapatok' }]" />
    </div>

    <section class="team-directory__hero">
      <div class="container" data-reveal>
        <p class="eyebrow">Sárisápi BSE</p>
        <h1>Csapatok</h1>
      </div>
    </section>

    <section class="section team-directory">
      <div class="container">
        <nav class="team-directory__list" aria-label="Csapatok">
          <NuxtLink v-for="(team, index) in teamDefinitions" :key="team.slug" :to="`/csapatok/${team.slug}`" class="team-directory__item" data-reveal>
            <span class="team-directory__index numeric">{{ String(index + 1).padStart(2, '0') }}</span>
            <span><small>{{ team.name }}</small><strong>{{ team.competition }}</strong></span>
            <Icon name="lucide:arrow-up-right" aria-hidden="true" />
          </NuxtLink>
        </nav>
      </div>
    </section>
  </div>
</template>

<style scoped>
.team-directory__hero{padding-block:clamp(2.5rem,6vw,4.5rem);border-bottom:1px solid var(--color-line);background:var(--color-surface)}.team-directory__hero .eyebrow{margin-bottom:var(--space-4)}.team-directory__hero h1{max-width:10ch;font-size:clamp(3rem,7vw,5.5rem)}.section{padding:0 0 var(--section-space)!important}.team-directory__intro{max-width:43rem;margin-top:var(--space-8);color:var(--color-muted)}.team-directory__list{display:grid;margin-top:clamp(3rem,7vw,6rem);border-top:1px solid var(--color-line)}.team-directory__item{display:grid;min-height:8rem;grid-template-columns:3.5rem minmax(0,1fr) auto;align-items:center;gap:var(--space-4);border-bottom:1px solid var(--color-line);color:var(--color-ink);text-decoration:none}.team-directory__item:hover{color:var(--color-brand)}.team-directory__index{color:var(--color-accent);font-size:1.25rem}.team-directory__item span:nth-child(2){display:grid;gap:var(--space-2)}.team-directory__item small{color:var(--color-muted);font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.team-directory__item strong{font-family:var(--font-display);font-size:clamp(1.35rem,3vw,2.25rem);line-height:1}.team-directory__item svg{width:1.25rem;transition:transform var(--duration-fast) var(--ease-out)}.team-directory__item:hover svg{transform:translate(.25rem,-.25rem)}.team-values__grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--color-line)}.team-values article{padding:2rem 2rem 2rem 0;border-right:1px solid var(--color-line)}.team-values article+article{padding-left:2rem}.team-values article:last-child{border-right:0}.team-values__icon{width:1.5rem;height:1.5rem;color:var(--color-accent)}.team-values h4{margin:2rem 0 1rem}.team-values p{color:var(--color-muted);font-size:.9rem}@media(max-width:767px){.team-values__grid{grid-template-columns:1fr}.team-directory__item{min-height:7rem;grid-template-columns:2.75rem minmax(0,1fr) auto}.team-directory__item strong{overflow-wrap:anywhere}.team-values article,.team-values article+article{padding:2rem 0;border-right:0;border-bottom:1px solid var(--color-line)}}
</style>
