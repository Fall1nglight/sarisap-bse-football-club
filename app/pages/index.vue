<script setup lang="ts">
const { data } = await useAsyncData('home-data', async () => {
  const [news, club, sponsors] = await Promise.all([
    queryCollection('news').order('publishedAt', 'DESC').limit(3).all(),
    queryCollection('club').first(),
    queryCollection('sponsors').first(),
  ])
  return { news, club, sponsors }
})

const sponsorList = computed(() => data.value?.sponsors?.sponsors.slice(0, 6) || [])

const heroSlides = [
  { src: '/images/club/sporttelep-hero.png', width: 1672, height: 934 },
  { src: '/images/club/hero-csapategyseg.png', width: 1672, height: 941 },
  { src: '/images/club/hero-utanpotlas.png', width: 1672, height: 941 },
  { src: '/images/club/hero-merkozes.png', width: 1672, height: 941 },
  { src: '/images/club/hero-szurkolok.png', width: 1672, height: 941 },
]

const activeHeroSlide = ref(0)
let heroSlideInterval: ReturnType<typeof setInterval> | undefined
let reducedMotionQuery: MediaQueryList | undefined

const stopHeroSlider = () => {
  if (heroSlideInterval) clearInterval(heroSlideInterval)
  heroSlideInterval = undefined
}

const startHeroSlider = () => {
  stopHeroSlider()
  if (reducedMotionQuery?.matches) return

  heroSlideInterval = setInterval(() => {
    activeHeroSlide.value = (activeHeroSlide.value + 1) % heroSlides.length
  }, 5000)
}

const handleReducedMotionChange = () => {
  if (reducedMotionQuery?.matches) activeHeroSlide.value = 0
  startHeroSlider()
}

onMounted(() => {
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotionQuery.addEventListener('change', handleReducedMotionChange)
  startHeroSlider()
})

onBeforeUnmount(() => {
  stopHeroSlider()
  reducedMotionQuery?.removeEventListener('change', handleReducedMotionChange)
})

useSiteSeo({
  title: 'Kezdőlap',
  description: 'A Sárisápi BSE hivatalos kluboldala: hírek, csapatok, mérkőzések, utánpótlás és klubélet egy helyen.',
  image: '/images/club/sporttelep-hero.png',
})

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  name: data.value?.club?.name || 'Sárisápi Bányász Sport Egyesület',
  sport: 'Labdarúgás',
  foundingDate: String(data.value?.club?.founded || 1940),
  url: useRuntimeConfig().public.siteUrl,
  location: {
    '@type': 'Place',
    name: data.value?.club?.venue.name,
    address: data.value?.club?.venue.address,
  },
})
</script>

<template>
  <div>
    <section class="home-hero">
      <div class="home-hero__media" aria-hidden="true">
        <NuxtImg
          v-for="(slide, slideIndex) in heroSlides"
          :key="slide.src"
          class="home-hero__slide"
          :class="{ 'is-active': slideIndex === activeHeroSlide }"
          :src="slide.src"
          alt=""
          :width="slide.width"
          :height="slide.height"
          sizes="xs:100vw sm:100vw md:100vw xl:1440px"
          format="webp"
          :preload="slideIndex === 0"
          :fetchpriority="slideIndex === 0 ? 'high' : 'auto'"
          :loading="slideIndex === 0 ? 'eager' : 'lazy'"
        />
        <div class="home-hero__shade" />
      </div>
      <div class="container home-hero__inner">
        <div class="home-hero__copy">
          <p class="eyebrow home-hero__step home-hero__step--1">Sárisáp · közösség · labdarúgás</p>
          <h1 class="home-hero__step home-hero__step--2">Egy pálya.<br><span>Sok történet.</span></h1>
          <p class="home-hero__lead home-hero__step home-hero__step--3">A pályán együtt. A pályán túl közösség.</p>
          <div class="button-row home-hero__step home-hero__step--4">
            <UiButton to="/csapatok/utanpotlas" variant="secondary">Csatlakozz hozzánk</UiButton>
          </div>
        </div>
        <div class="home-hero__crest" aria-hidden="true"><BrandMark /></div>
        <div class="home-hero__scroll" aria-hidden="true"><span /> Görgess tovább</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <UiSectionHeading eyebrow="A klub körül" title="Friss történetek" intro="Eredmények, edzések és azok az emberek, akik életben tartják a helyi futballt." align="split" />
        <div class="news-grid">
          <NewsCard v-for="article in data?.news" :key="article.path" class="news-grid__item" :article="article" data-reveal />
        </div>
        <div class="section-link"><UiButton to="/hirek" variant="text">Összes hír</UiButton></div>
      </div>
    </section>

    <section class="teams-teaser">
      <NuxtLink class="teams-teaser__item" to="/csapatok/felnott">
        <NuxtImg src="/images/club/csapatkor.png" alt="Felnőtt labdarúgók csapatkörben" width="1536" height="1024" sizes="xs:100vw md:50vw" format="webp" loading="lazy" />
        <span class="teams-teaser__shade" />
        <span class="teams-teaser__content"><small>Felnőtt</small><strong>Tapasztalat<br>és bátorság.</strong><Icon name="lucide:arrow-up-right" /></span>
      </NuxtLink>
      <NuxtLink class="teams-teaser__item" to="/csapatok/utanpotlas">
        <NuxtImg src="/images/club/utanpotlas-edzes.png" alt="Utánpótláskorú gyerekek labdás edzésen" width="1536" height="1024" sizes="xs:100vw md:50vw" format="webp" loading="lazy" />
        <span class="teams-teaser__shade" />
        <span class="teams-teaser__content"><small>Utánpótlás</small><strong>Itt kezdődik<br>a játék.</strong><Icon name="lucide:arrow-up-right" /></span>
      </NuxtLink>
    </section>

    <section class="section history-section">
      <div class="container history-section__grid">
        <div data-reveal>
          <p class="eyebrow">1940 óta</p>
          <h2>Nemcsak a tabella őrzi a múltunkat.</h2>
        </div>
        <div data-reveal>
          <p>{{ data?.club?.history }}</p>
          <UiButton to="/kapcsolat" variant="text">Ismerd meg a klubot</UiButton>
        </div>
      </div>
    </section>

    <section class="section section--surface sponsors-strip">
      <div class="container">
        <UiSectionHeading eyebrow="Akik mellettünk állnak" title="Közösen erősebb" intro="Támogatóink hozzájárulása nélkülözhetetlen ahhoz, hogy csapataink fejlődhessenek, és közösségünk tovább erősödhessen." align="split" />
        <div class="sponsors-strip__grid">
          <div v-for="sponsor in sponsorList" :key="sponsor.name">
            <img :src="sponsor.logo" :alt="sponsor.description" width="320" height="120">
          </div>
        </div>
        <div class="section-link"><UiButton to="/tamogatok" variant="text">Minden támogatónk</UiButton></div>
      </div>
    </section>

<!--    <section class="recruit-cta section&#45;&#45;brand">-->
<!--      <div class="container recruit-cta__grid">-->
<!--        <div data-reveal><p class="eyebrow">U7-től U19-ig</p><h2>A következő történet veled kezdődhet.</h2></div>-->
<!--        <div data-reveal><p>Ismerd meg a korosztályokat, az edzésidőket és az edzőket. Az első lépés egy jó hangulatú próbaedzés.</p><UiButton to="/csapatok/utanpotlas" variant="secondary">Utánpótlás program</UiButton></div>-->
<!--      </div>-->
<!--    </section>-->

    <section class="venue-teaser">
      <NuxtImg src="/images/club/sporttelep-hero.png" alt="A Sárisápi Sporttelep füves labdarúgópályája" width="1672" height="934" sizes="xs:100vw md:100vw" format="webp" loading="lazy" />
      <div class="container venue-teaser__card" data-reveal>
        <p class="eyebrow">Találkozzunk a pályán</p>
        <h2>Sárisápi Sporttelep</h2>
        <p>{{ data?.club?.venue.address }}</p>
        <UiButton to="/kapcsolat" variant="secondary">Helyszín és kapcsolat</UiButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-hero { position: relative; min-height: max(42rem, calc(100svh - 7.5rem)); overflow: hidden; color: #fffdf7; }
.home-hero__media, .home-hero__shade { position: absolute; inset: 0; }
.home-hero__media :deep(.home-hero__slide) { position: absolute; width: 100%; height: 100%; inset: 0; object-fit: cover; opacity: 0; transition: opacity 2.4s cubic-bezier(.4, 0, .2, 1); }
.home-hero__media :deep(.home-hero__slide.is-active) { opacity: 1; }
.home-hero__shade { z-index: 1; background: linear-gradient(90deg, rgba(12, 19, 15, .83) 0%, rgba(12, 19, 15, .53) 47%, rgba(12, 19, 15, .12) 78%), linear-gradient(0deg, rgba(12, 19, 15, .5), transparent 45%); }
.home-hero__inner { position: relative; display: grid; min-height: max(42rem, calc(100svh - 7.5rem)); align-items: center; grid-template-columns: minmax(0, 1fr) auto; padding-block: clamp(5rem, 10vw, 8rem); }
.home-hero__copy { z-index: 1; max-width: 58rem; }
.home-hero .eyebrow { color: #d4b36e; }
.home-hero h1 { color: #fffdf7; }
.home-hero h1 span { color: #b8cbbf; }
.home-hero__lead { max-width: 32rem; margin: 2rem 0; color: rgba(255,253,247,.82); font-size: clamp(1.1rem, 1rem + .5vw, 1.4rem); }
.home-hero .ui-button--secondary { border-color: rgba(255,255,255,.45); color: #fffdf7; }
.home-hero__crest { width: clamp(6rem, 12vw, 11rem); opacity: .72; filter: brightness(0) invert(1); }
.home-hero__scroll { position: absolute; z-index: 1; bottom: 2rem; left: 0; display: flex; align-items: center; gap: .85rem; color: rgba(255,253,247,.94); font-size: .75rem; font-weight: 700; letter-spacing: .12em; text-shadow: 0 1px 12px rgba(0,0,0,.85); text-transform: uppercase; }
.home-hero__scroll span { width: 3rem; height: 2px; background: #d4b36e; box-shadow: 0 1px 8px rgba(0,0,0,.55); }
.home-hero__step { animation: hero-in .62s var(--ease-out) both; }
.home-hero__step--1 { animation-delay: .05s; }.home-hero__step--2 { animation-delay: .12s; }.home-hero__step--3 { animation-delay: .19s; }.home-hero__step--4 { animation-delay: .26s; }
@keyframes hero-in { from { transform: translateY(1rem); opacity: 0; } }
.news-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(1.5rem, 3vw, 2.5rem); }
.section-link { margin-top: 2rem; border-top: 1px solid var(--color-line); }
.teams-teaser { display: grid; grid-template-columns: 1fr 1fr; }
.teams-teaser__item { position: relative; display: grid; min-height: clamp(30rem, 55vw, 48rem); overflow: hidden; align-items: end; color: #fffdf7; text-decoration: none; }
.teams-teaser__item :deep(img), .teams-teaser__shade { position: absolute; width: 100%; height: 100%; inset: 0; object-fit: cover; transition: transform .65s var(--ease-out); }
.teams-teaser__shade { background: linear-gradient(0deg, rgba(12,19,15,.82), transparent 65%); }
.teams-teaser__content { position: relative; z-index: 1; display: grid; padding: clamp(2rem, 6vw, 5rem); }
.teams-teaser__content small { margin-bottom: 1rem; color: #d4b36e; font-size: .72rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.teams-teaser__content strong { font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 5.5rem); line-height: .9; }
.teams-teaser__content svg { width: 2rem; margin-top: 1.5rem; transition: transform var(--duration-base) var(--ease-out); }
.teams-teaser__item:hover :deep(img) { transform: scale(1.025); }.teams-teaser__item:hover svg { transform: translate(.3rem,-.3rem); }
.history-section__grid, .recruit-cta__grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(18rem, .8fr); gap: clamp(3rem, 8vw, 8rem); }
.history-section h2 { max-width: 12ch; }.history-section__grid > div:last-child p { max-width: 38rem; color: var(--color-muted); }
.sponsors-strip__grid { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--color-line); border-left: 1px solid var(--color-line); }
.sponsors-strip__grid > div { display: grid; min-height: 9rem; place-items: center; padding: 1.5rem; border-right: 1px solid var(--color-line); border-bottom: 1px solid var(--color-line); background: #fbfaf5; }
.sponsors-strip__grid img { width: min(100%, 16rem); }
.recruit-cta { padding-block: var(--section-space); }.recruit-cta h2 { max-width: 12ch; }.recruit-cta__grid > div:last-child p { margin-bottom: 2rem; color: color-mix(in srgb, var(--color-on-brand) 75%, transparent); }
.venue-teaser { position: relative; min-height: 42rem; display: grid; align-items: end; overflow: hidden; }.venue-teaser > :deep(img) { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }.venue-teaser::after { position: absolute; inset: 0; background: linear-gradient(90deg,rgba(12,19,15,.65),transparent 70%); content:''; }.venue-teaser__card { position: relative; z-index: 1; width: min(100% - 2 * var(--page-gutter), var(--container)); margin-bottom: clamp(2rem,5vw,5rem); padding: clamp(2rem,5vw,4rem); background: var(--color-canvas); }.venue-teaser__card h2 { margin-bottom: 1rem; }.venue-teaser__card p:not(.eyebrow) { margin-bottom: 2rem; color: var(--color-muted); }
@media (max-width: 767px) { .home-hero__inner { grid-template-columns: 1fr; }.home-hero__crest { display:none; }.home-hero__shade { background: linear-gradient(90deg,rgba(12,19,15,.82),rgba(12,19,15,.3)); }.news-grid,.teams-teaser,.history-section__grid,.recruit-cta__grid { grid-template-columns: 1fr; }.news-grid__item:nth-child(n+3) { display: none; }.teams-teaser__item { min-height: 32rem; }.sponsors-strip__grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 479px) { .sponsors-strip__grid { grid-template-columns: 1fr; }.venue-teaser__card { width: calc(100% - 2rem); } }
@media (prefers-reduced-motion: reduce) { .home-hero__media :deep(.home-hero__slide) { transition: none; }.home-hero__step { animation: none; }.teams-teaser__item:hover :deep(img),.teams-teaser__item:hover svg { transform:none; } }
</style>
