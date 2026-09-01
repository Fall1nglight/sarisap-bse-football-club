<script setup lang="ts">
const { data } = await useAsyncData('tao-page', () => queryCollection('taoDocuments').first())
const groups = computed(() => {
  const grouped = new Map<string, NonNullable<typeof data.value>['documents']>()
  for (const document of data.value?.documents || []) {
    grouped.set(document.season, [...(grouped.get(document.season) || []), document])
  }
  return [...grouped.entries()].map(([season, documents]) => ({ season, documents }))
})
const documentCount = computed(() => data.value?.documents.length || 0)
useSiteSeo({ title: 'TAO dokumentumok', description: 'A Sárisápi BSE évadonként rendezett TAO dokumentumtára.' })
</script>

<template>
  <div>
    <section class="section tao-section">
      <div class="container tao-layout">
        <header class="tao-intro">
          <p class="eyebrow">TAO dokumentumtár</p>
          <h1>Dokumentumok, évadról évadra.</h1>
          <p>A klub TAO-hoz kapcsolódó anyagai egy helyen, időrendben rendezve és könnyen áttekinthető formában.</p>
          <div class="tao-overview" aria-label="Dokumentumtár összesítése">
            <span><strong>{{ groups.length }}</strong> évad</span>
            <span><strong>{{ documentCount }}</strong> dokumentum</span>
          </div>
        </header>
        <div class="tao-groups">
          <details v-for="(group,index) in groups" :key="group.season" :open="index===0">
            <summary>
              <span class="season-index">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="season-title"><small>Évad</small><strong>{{ group.season }}</strong></span>
              <span class="season-count">{{ group.documents.length }} dokumentum</span>
              <Icon name="lucide:plus" aria-hidden="true" />
            </summary>
            <div class="document-list">
              <a v-for="document in group.documents" :key="document.file" :href="document.file" target="_blank" rel="noopener" :aria-label="`${document.type} megnyitása új lapon`">
                <span class="document-format" aria-hidden="true">PDF</span>
                <span class="document-copy"><strong>{{ document.type }}</strong><small>{{ formatDate(document.date) }} · {{ document.fileSize }}</small></span>
                <span class="document-action">Megnyitás <Icon name="lucide:arrow-up-right" aria-hidden="true" /></span>
              </a>
            </div>
          </details>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tao-layout{display:grid;grid-template-columns:minmax(16rem,.42fr) minmax(0,.58fr);align-items:start;gap:clamp(4rem,9vw,9rem)}.tao-intro{position:sticky;top:calc(var(--header-height) + 2rem)}.tao-intro h1{max-width:9ch;font-size:clamp(3rem,6vw,5.75rem);line-height:.9}.tao-intro>p:not(.eyebrow){max-width:32rem;margin-top:2rem;color:var(--color-muted)}.tao-overview{display:flex;max-width:24rem;gap:2rem;margin-top:4rem;padding-top:1.5rem;border-top:1px solid var(--color-line)}.tao-overview span{display:flex;align-items:baseline;gap:.5rem;color:var(--color-muted);font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.tao-overview strong{color:var(--color-brand);font-family:var(--font-display);font-size:2rem;line-height:1}.tao-groups{border-top:1px solid var(--color-line)}details{border-bottom:1px solid var(--color-line)}summary{display:grid;min-height:7rem;align-items:center;grid-template-columns:3rem minmax(0,1fr) auto 1.5rem;gap:1rem;cursor:pointer;list-style:none}summary::-webkit-details-marker{display:none}.season-index{color:var(--color-accent);font-family:var(--font-display);font-size:.85rem;font-weight:700}.season-title{display:grid;gap:.25rem}.season-title small{color:var(--color-muted);font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.season-title strong{font-family:var(--font-display);font-size:clamp(1.8rem,3vw,2.6rem);line-height:1}.season-count{color:var(--color-muted);font-size:.72rem;font-weight:700;white-space:nowrap}summary>svg{width:1.3rem;transition:transform var(--duration-base)}details[open] summary>svg{transform:rotate(45deg)}.document-list{padding:0 0 2rem 4rem}.document-list a{display:grid;min-height:6rem;align-items:center;grid-template-columns:3rem minmax(0,1fr) auto;gap:1rem;padding:1rem;border-top:1px solid var(--color-line);text-decoration:none;transition:background-color var(--duration-fast)}.document-list a:hover{background:var(--color-surface)}.document-format{display:grid;width:2.5rem;height:2.5rem;place-items:center;border:1px solid var(--color-line);border-radius:var(--radius-sm);color:var(--color-brand);font-family:var(--font-display);font-size:.72rem;font-weight:700;letter-spacing:.05em}.document-copy{display:grid;min-width:0}.document-copy strong{font-size:.9rem}.document-copy small{margin-top:.35rem;color:var(--color-muted);font-size:.7rem}.document-action{display:flex;align-items:center;gap:.5rem;color:var(--color-muted);font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.document-action svg{width:1rem;transition:transform var(--duration-fast)}.document-list a:hover .document-action svg{transform:translate(.2rem,-.2rem)}@media(max-width:900px){.tao-layout{grid-template-columns:1fr}.tao-intro{position:static}.tao-intro h1{max-width:11ch}.tao-overview{margin-top:3rem}}@media(max-width:600px){summary{min-height:6rem;grid-template-columns:2rem minmax(0,1fr) 1.5rem}.season-count{display:none}summary>svg{grid-column:3}.document-list{padding-left:0}.document-list a{grid-template-columns:3rem minmax(0,1fr) auto;padding-inline:0}.document-action{font-size:0}.document-action svg{width:1.1rem}}
</style>
