interface SiteSeoOptions {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
}

export function useSiteSeo(options: SiteSeoOptions) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const url = computed(() => new URL(options.path || route.path, config.public.siteUrl).toString())
  const image = computed(() => new URL(options.image || '/brand/og-default.svg', config.public.siteUrl).toString())

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogUrl: url,
    ogImage: image,
    ogType: options.type || 'website',
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: image,
  })
}

export function useJsonLd(data: Record<string, unknown> | Array<Record<string, unknown>>) {
  useHead({
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(data) }],
  })
}
