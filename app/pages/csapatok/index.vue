<script setup lang="ts">
import { teamDefinitions } from '~~/shared/teams'

useSiteSeo({ title: 'Csapatok', description: 'Ismerd meg a Sárisápi BSE öt bajnokságban szereplő csapatát, valamint a legutóbbi és következő mérkőzéseiket.' })
</script>

<template>
  <div>
    <section class="section team-directory">
      <div class="container">
        <p class="eyebrow">Csapatok</p>
        <h1>Öt csapat. Egy közösség.</h1>
        <p class="team-directory__intro">Válaszd ki a bajnokságot: minden csapat oldalán az utolsó eredmény és a következő találkozó is elérhető.</p>
        <nav class="team-directory__list" aria-label="Csapatok">
          <NuxtLink v-for="(team, index) in teamDefinitions" :key="team.slug" :to="`/csapatok/${team.slug}`" class="team-directory__item" data-reveal>
            <span class="team-directory__index numeric">{{ String(index + 1).padStart(2, '0') }}</span>
            <span><small>{{ team.name }}</small><strong>{{ team.competition }}</strong></span>
            <Icon name="lucide:arrow-up-right" aria-hidden="true" />
          </NuxtLink>
        </nav>
      </div>
    </section>
    <section class="section section--surface team-values">
      <div class="container"><UiSectionHeading eyebrow="Ami összeköt" title="Játék. Fejlődés. Felelősség." intro="Nemcsak játékosokat, hanem egymásra figyelő helyi közösséget szeretnénk építeni." align="split" />
        <div class="team-values__grid">
          <article data-reveal><span>01</span><h4>Bátor játék</h4><p>A döntésekből tanulunk, a kezdeményezést minden korosztályban értékeljük.</p></article>
          <article data-reveal><span>02</span><h4>Következetes munka</h4><p>A fejlődést a rendszeres, életkorhoz illő és örömteli edzés alapozza meg.</p></article>
          <article data-reveal><span>03</span><h4>Helyi kötődés</h4><p>A pálya találkozási pont, ahol a játékos, a család és a szurkoló együtt számít.</p></article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.team-directory h1{max-width:10ch}.team-directory__intro{max-width:43rem;margin-top:var(--space-8);color:var(--color-muted)}.team-directory__list{display:grid;margin-top:clamp(3rem,7vw,6rem);border-top:1px solid var(--color-line)}.team-directory__item{display:grid;min-height:8rem;grid-template-columns:3.5rem minmax(0,1fr) auto;align-items:center;gap:var(--space-4);border-bottom:1px solid var(--color-line);color:var(--color-ink);text-decoration:none}.team-directory__item:hover{color:var(--color-brand)}.team-directory__index{color:var(--color-accent);font-size:1.25rem}.team-directory__item span:nth-child(2){display:grid;gap:var(--space-2)}.team-directory__item small{color:var(--color-muted);font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.team-directory__item strong{font-family:var(--font-display);font-size:clamp(1.35rem,3vw,2.25rem);line-height:1}.team-directory__item svg{width:1.25rem;transition:transform var(--duration-fast) var(--ease-out)}.team-directory__item:hover svg{transform:translate(.25rem,-.25rem)}.team-values__grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--color-line)}.team-values article{padding:2rem 2rem 2rem 0;border-right:1px solid var(--color-line)}.team-values article+article{padding-left:2rem}.team-values article:last-child{border-right:0}.team-values article>span{color:var(--color-accent);font:700 1rem var(--font-display)}.team-values h4{margin:2rem 0 1rem}.team-values p{color:var(--color-muted);font-size:.9rem}@media(max-width:767px){.team-values__grid{grid-template-columns:1fr}.team-directory__item{min-height:7rem;grid-template-columns:2.75rem minmax(0,1fr) auto}.team-directory__item strong{overflow-wrap:anywhere}.team-values article,.team-values article+article{padding:2rem 0;border-right:0;border-bottom:1px solid var(--color-line)}}
</style>
