<script setup lang="ts">
defineProps<{
  article: {
    path: string
    title: string
    excerpt: string
    category: string
    publishedAt: string
    cover: string
    coverAlt: string
  }
  large?: boolean
}>()
</script>

<template>
  <article class="news-card" :class="{ 'news-card--large': large }">
    <NuxtLink class="news-card__image" :to="article.path" tabindex="-1" aria-hidden="true">
      <NuxtImg
        :src="article.cover"
        :alt="article.coverAlt"
        width="900"
        height="600"
        sizes="xs:100vw sm:100vw md:50vw xl:640px"
        loading="lazy"
        format="webp"
      />
    </NuxtLink>
    <div class="news-card__body">
      <div class="news-card__meta">
        <span>{{ article.category }}</span>
        <time :datetime="article.publishedAt">{{ formatDate(article.publishedAt) }}</time>
      </div>
      <h4><NuxtLink :to="article.path">{{ article.title }}</NuxtLink></h4>
      <p>{{ article.excerpt }}</p>
      <NuxtLink class="news-card__link" :to="article.path" :aria-label="`${article.title} elolvasása`">
        Elolvasom <Icon name="lucide:arrow-right" aria-hidden="true" />
      </NuxtLink>
    </div>
  </article>
</template>

<style scoped>
.news-card { display: grid; min-width: 0; border-top: 1px solid var(--color-line); }
.news-card__image { overflow: hidden; aspect-ratio: 3 / 2; background: var(--color-surface-strong); text-decoration: none; }
.news-card__image :deep(img) { width: 100%; height: 100%; object-fit: cover; transition: transform var(--duration-reveal) var(--ease-out); }
.news-card:hover .news-card__image :deep(img) { transform: scale(1.025); }
.news-card__body { display: flex; min-width: 0; flex-direction: column; align-items: flex-start; padding: 1.5rem 0 0; }
.news-card__meta { display: flex; flex-wrap: wrap; gap: .5rem 1rem; margin-bottom: 1rem; color: var(--color-muted); font-size: .7rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.news-card__meta span { color: var(--color-accent); }
.news-card h4 { max-width: 22ch; margin-bottom: 1rem; }
.news-card h4 a { display: inline-flex; min-height: 44px; align-items: center; text-decoration: none; }
.news-card h4 a:hover { color: var(--color-brand); }
.news-card p { color: var(--color-muted); font-size: .9rem; line-height: 1.65; }
.news-card__link { display: inline-flex; min-height: 44px; align-items: center; gap: .5rem; margin-top: 1rem; color: var(--color-brand); font-size: .78rem; font-weight: 700; text-decoration: none; }
.news-card__link svg { width: 1rem; transition: transform var(--duration-fast) var(--ease-out); }
.news-card:hover .news-card__link svg { transform: translateX(.25rem); }
.news-card--large { grid-template-columns: minmax(0, 1.45fr) minmax(18rem, .75fr); border-bottom: 1px solid var(--color-line); }
.news-card--large .news-card__image { aspect-ratio: 16 / 10; }
.news-card--large .news-card__body { justify-content: center; padding: clamp(2rem, 5vw, 5rem); }
.news-card--large h4 { font-size: clamp(2rem, 4vw, 3.75rem); }
@media (max-width: 767px) { .news-card--large { grid-template-columns: 1fr; } .news-card--large .news-card__body { padding: 1.5rem 0 2rem; } }
@media (prefers-reduced-motion: reduce) { .news-card:hover .news-card__image :deep(img) { transform: none; } }
</style>
