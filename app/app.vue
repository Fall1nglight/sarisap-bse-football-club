<script setup lang="ts">
const MIN_PAGE_LOADING_MS = 500

const config = useRuntimeConfig()
const route = useRoute()
const isPageLoading = ref(false)
const canonical = computed(() => new URL(route.path, config.public.siteUrl).toString())

let pageLoadingStartedAt = 0
let finishPageLoadingTimer: ReturnType<typeof setTimeout> | undefined

if (import.meta.client) {
  const nuxtApp = useNuxtApp()

  nuxtApp.hook('page:start', () => {
    if (finishPageLoadingTimer) clearTimeout(finishPageLoadingTimer)

    pageLoadingStartedAt = Date.now()
    isPageLoading.value = true
  })

  nuxtApp.hook('page:finish', () => {
    if (!isPageLoading.value) return

    const elapsed = Date.now() - pageLoadingStartedAt
    const remaining = Math.max(MIN_PAGE_LOADING_MS - elapsed, 0)

    finishPageLoadingTimer = setTimeout(() => {
      isPageLoading.value = false
      finishPageLoadingTimer = undefined
    }, remaining)
  })

  onBeforeUnmount(() => {
    if (finishPageLoadingTimer) clearTimeout(finishPageLoadingTimer)
  })
}

useHead({
  link: [{ rel: 'canonical', href: canonical }],
})

useSeoMeta({
  robots: () => config.public.siteIndexable ? 'index, follow' : 'noindex, nofollow',
  ogLocale: 'hu_HU',
  ogSiteName: 'Sárisápi BSE',
  ogType: 'website',
  ogImage: () => new URL('/brand/og-default.svg', config.public.siteUrl).toString(),
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">Ugrás a tartalomra</a>
    <LayoutAppHeader />
    <main id="main-content" :aria-busy="isPageLoading || undefined" tabindex="-1">
      <NuxtPage />
    </main>
    <Teleport to="body">
      <div v-if="isPageLoading" class="page-loading" role="status" aria-live="polite">
        <div class="page-loading__content">
          <span class="page-loading__spinner" aria-hidden="true" />
          <span>Betöltés...</span>
        </div>
      </div>
    </Teleport>
    <LayoutAppFooter />
  </div>
</template>

<style>
.page-loading {
  position: fixed;
  z-index: 90;
  inset: var(--header-height) 0 0;
  display: grid;
  place-items: center;
  background: var(--color-loading-scrim);
  color: var(--color-loading-text);
}

.page-loading__content {
  display: grid;
  justify-items: center;
  gap: var(--space-4);
  font-size: .9rem;
  font-weight: 700;
}

.page-loading__spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid color-mix(in srgb, var(--color-accent) 28%, transparent);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: page-loading-spin .85s linear infinite;
}

@keyframes page-loading-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .page-loading__spinner { animation: none; }
}
</style>
