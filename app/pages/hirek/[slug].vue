<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug))
const { data: article } = await useAsyncData(`news-${slug.value}`, () => queryCollection('news').path(`/hirek/${slug.value}`).first())

if (!article.value) throw createError({ statusCode: 404, statusMessage: 'A hír nem található' })

const { data: related } = await useAsyncData(`related-${slug.value}`, () => queryCollection('news').where('category', '=', article.value!.category).where('path', '<>', article.value!.path).order('publishedAt', 'DESC').limit(2).all())
const config = useRuntimeConfig()

useSiteSeo({ title: article.value.title, description: article.value.description, image: article.value.cover, type: 'article' })
useSeoMeta({ articlePublishedTime: article.value.publishedAt, articleModifiedTime: article.value.updatedAt || article.value.publishedAt, articleAuthor: [article.value.author], articleSection: article.value.category })
useJsonLd([
  {
    '@context': 'https://schema.org', '@type': 'NewsArticle', headline: article.value.title,
    description: article.value.description, image: new URL(article.value.cover, config.public.siteUrl).toString(),
    datePublished: article.value.publishedAt, dateModified: article.value.updatedAt || article.value.publishedAt,
    author: { '@type': 'Organization', name: article.value.author },
    publisher: { '@type': 'SportsOrganization', name: 'Sárisápi BSE' },
    mainEntityOfPage: new URL(article.value.path, config.public.siteUrl).toString(),
  },
  {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Főoldal', item: config.public.siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Hírek', item: new URL('/hirek', config.public.siteUrl).toString() },
      { '@type': 'ListItem', position: 3, name: article.value.title },
    ],
  },
])
</script>

<template>
  <article v-if="article" class="article-page">
    <div class="container"><UiBreadcrumbs :items="[{ label: 'Főoldal', to: '/' }, { label: 'Hírek', to: '/hirek' }, { label: article.title }]" /></div>
    <header class="article-header container">
      <div class="article-header__meta"><span>{{ article.category }}</span><time :datetime="article.publishedAt">{{ formatDate(article.publishedAt) }}</time></div>
      <h1>{{ article.title }}</h1>
      <p>{{ article.excerpt }}</p>
      <div class="article-header__author">{{ article.author }}</div>
    </header>
    <figure class="article-cover container">
      <NuxtImg :src="article.cover" :alt="article.coverAlt" width="1536" height="1024" sizes="xs:100vw sm:100vw md:90vw xl:1280px" format="webp" preload />
    </figure>
    <div class="article-layout container">
      <aside aria-label="Cikk információ"><span>Megjelent</span><strong>{{ formatDate(article.publishedAt) }}</strong><span>Kategória</span><strong>{{ article.category }}</strong></aside>
      <div class="article-body"><ContentRenderer :value="article" /></div>
    </div>
    <section v-if="related?.length" class="section section--surface">
      <div class="container"><UiSectionHeading eyebrow="További történetek" title="Kapcsolódó hírek" /><div class="related-grid"><NewsCard v-for="item in related" :key="item.path" :article="item" /></div></div>
    </section>
  </article>
</template>

<style scoped>
.article-header{padding-block:clamp(3rem,8vw,7rem);text-align:center}.article-header__meta{display:flex;flex-wrap:wrap;justify-content:center;gap:.75rem 1.5rem;margin-bottom:2rem;color:var(--color-muted);font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.article-header__meta span:first-child{color:var(--color-accent)}.article-header h1{max-width:12ch;margin-inline:auto;font-size:clamp(3rem,8vw,7rem)}.article-header>p{max-width:48rem;margin:2rem auto 0;color:var(--color-muted);font-size:clamp(1.1rem,1rem + .5vw,1.4rem)}.article-header__author{margin-top:1.5rem;font-size:.78rem;font-weight:700}.article-cover{overflow:hidden;aspect-ratio:16/9;background:var(--color-surface-strong)}.article-cover :deep(img){width:100%;height:100%;object-fit:cover}.article-layout{display:grid;grid-template-columns:12rem minmax(0,46rem);justify-content:center;gap:clamp(3rem,7vw,7rem);padding-block:var(--section-space)}.article-layout aside{display:flex;align-self:start;flex-direction:column;padding-top:.5rem;border-top:1px solid var(--color-line)}.article-layout aside span{margin-top:1rem;color:var(--color-muted);font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.article-layout aside strong{font-size:.8rem}.article-body{min-width:0}.article-body :deep(p){margin-bottom:1.5rem}.article-body :deep(h2){margin:3.5rem 0 1.5rem;font-size:clamp(2rem,4vw,3.5rem)}.article-body :deep(h2 a){display:flex;min-height:44px;align-items:center}.article-body :deep(blockquote){margin:2.5rem 0;padding:1.5rem 2rem;border-left:3px solid var(--color-accent);background:var(--color-surface);font-family:var(--font-display);font-size:1.5rem;line-height:1.25}.article-body :deep(a){color:var(--color-brand)}.related-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem}@media(max-width:767px){.article-layout{grid-template-columns:1fr}.article-layout aside{display:grid;grid-template-columns:auto 1fr;gap:.25rem 1rem}.related-grid{grid-template-columns:1fr}}
</style>
