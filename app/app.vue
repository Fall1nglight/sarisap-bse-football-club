<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()
const canonical = computed(() => new URL(route.path, config.public.siteUrl).toString())

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
    <main id="main-content" tabindex="-1">
      <NuxtPage />
    </main>
    <LayoutAppFooter />
  </div>
</template>
