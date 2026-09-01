<script setup lang="ts">
const categories = ['Összes', 'Felnőtt', 'Utánpótlás', 'Egyesület', 'Közösség'] as const
const activeCategory = ref<(typeof categories)[number]>('Összes')
const { data: articles } = await useAsyncData('all-news', () => queryCollection('news').order('publishedAt', 'DESC').all())
const featured = computed(() => articles.value?.find(article => article.featured) || articles.value?.[0])
const filtered = computed(() => (articles.value || []).filter(article => article.path !== featured.value?.path && (activeCategory.value === 'Összes' || article.category === activeCategory.value)))

useSiteSeo({ title: 'Hírek', description: 'A Sárisápi BSE legfrissebb felnőtt-, utánpótlás-, egyesületi és közösségi hírei.' })
useJsonLd({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Sárisápi BSE hírek', description: 'Klubhírek és közösségi történetek.' })
</script>

<template>
  <div>
    <section v-if="featured" class="section section--compact">
      <div class="container"><NewsCard :article="featured" large /></div>
    </section>
    <section class="section section--surface">
      <div class="container">
        <div class="news-toolbar">
          <p class="eyebrow">Tallózás</p>
          <div class="category-filters" aria-label="Hírek kategóriaszűrője">
            <button v-for="category in categories" :key="category" type="button" :aria-pressed="activeCategory === category" @click="activeCategory = category">{{ category }}</button>
          </div>
        </div>
        <div v-if="filtered.length" class="news-list">
          <NewsCard v-for="article in filtered" :key="article.path" :article="article" data-reveal />
        </div>
        <div v-else class="empty-state"><Icon name="lucide:newspaper" /><h3>Nincs ilyen hír.</h3><p>Válassz másik kategóriát.</p></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.news-toolbar { display:flex; align-items:flex-end; justify-content:space-between; gap:2rem; margin-bottom:3rem; border-bottom:1px solid var(--color-line); }.news-toolbar .eyebrow{margin-bottom:1rem}.category-filters{display:flex; overflow-x:auto; gap:.25rem; padding-bottom:1rem}.category-filters button{min-height:44px;padding:.6rem 1rem;border:1px solid transparent;border-radius:999px;background:transparent;color:var(--color-muted);font-size:.78rem;font-weight:700;cursor:pointer;white-space:nowrap}.category-filters button:hover{color:var(--color-ink);border-color:var(--color-line)}.category-filters button[aria-pressed=true]{background:var(--color-brand-strong);color:var(--color-on-brand)}.news-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(2rem,4vw,3.5rem)}.empty-state{display:grid;min-height:18rem;place-items:center;align-content:center;text-align:center;color:var(--color-muted)}.empty-state svg{width:2rem;margin-bottom:1rem;color:var(--color-brand)}.empty-state h3{margin-bottom:.5rem}@media(max-width:900px){.news-list{grid-template-columns:1fr 1fr}.news-toolbar{align-items:flex-start;flex-direction:column}}@media(max-width:600px){.news-list{grid-template-columns:1fr}.category-filters{width:100%}}
</style>
