import process from 'node:process'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://zippy-genie-68d5af.netlify.app'
const isIndexable = process.env.NUXT_PUBLIC_SITE_INDEXABLE !== 'false'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  devtools: { enabled: false },
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/eslint',
  ],
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true,
    typeCheck: true,
  },
  runtimeConfig: {
    public: {
      siteUrl,
      siteIndexable: isIndexable,
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'hu' },
      titleTemplate: '%s · Sárisápi BSE',
      meta: [
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#f3f0e8' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#151a17' },
      ],
      link: [
        { rel: 'icon', href: '/brand/favicon.svg', type: 'image/svg+xml' },
        { rel: 'manifest', href: '/brand/site.webmanifest' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'sbse-color-mode',
  },
  icon: {
    provider: 'none',
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
    },
  },
  fonts: {
    families: [
      { name: 'Manrope', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Barlow Condensed', provider: 'google', weights: [600, 700] },
    ],
  },
  image: {
    format: ['avif', 'webp'],
    quality: 82,
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1440 },
  },
  site: { url: siteUrl },
  sitemap: {
    enabled: true,
  },
  robots: {
    disallow: isIndexable ? [] : ['/'],
    sitemap: isIndexable ? [`${siteUrl}/sitemap.xml`] : [],
  },
  routeRules: {
    '/csapatok/**': { prerender: false },
    '/api/**': { prerender: false },
  },
})
