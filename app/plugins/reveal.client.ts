export default defineNuxtPlugin((nuxtApp) => {
  const root = document.documentElement
  let intersectionObserver: IntersectionObserver | null = null
  let mutationObserver: MutationObserver | null = null

  const revealAll = () => {
    document.querySelectorAll<HTMLElement>('[data-reveal]')
      .forEach(element => element.classList.add('is-visible'))
  }

  const observeElement = (element: Element) => {
    if (!(element instanceof HTMLElement) || element.classList.contains('is-visible')) return
    intersectionObserver?.observe(element)
  }

  const observeTree = (node: Node) => {
    if (!(node instanceof Element)) return
    if (node.matches('[data-reveal]')) observeElement(node)
    node.querySelectorAll('[data-reveal]').forEach(observeElement)
  }

  const cleanup = () => {
    intersectionObserver?.disconnect()
    mutationObserver?.disconnect()
    intersectionObserver = null
    mutationObserver = null
    root.classList.remove('motion-ready')
  }

  const initialize = () => {
    cleanup()

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window) || !('MutationObserver' in window)) {
      revealAll()
      return
    }

    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        intersectionObserver?.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -48px' })

    document.querySelectorAll('[data-reveal]').forEach(observeElement)

    const main = document.querySelector('#main-content')
    mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(observeTree))
    })
    mutationObserver.observe(main ?? document.body, { childList: true, subtree: true })

    root.classList.add('motion-ready')
  }

  nuxtApp.hook('app:mounted', initialize)
  nuxtApp.vueApp.onUnmount(cleanup)
  import.meta.hot?.dispose(cleanup)
})
