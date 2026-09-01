<script setup lang="ts">
const { data } = await useAsyncData('sponsors-page', () => queryCollection('sponsors').first())
const featured = computed(() => data.value?.sponsors.filter(sponsor => sponsor.level === 'Kiemelt') || [])
const community = computed(() => data.value?.sponsors.filter(sponsor => sponsor.level === 'Közösségi') || [])
useSiteSeo({ title: 'Támogatók', description: 'A Sárisápi BSE kiemelt és közösségi támogatói, valamint támogatói kapcsolat.' })
</script>

<template>
  <div>
    <section class="section"><div class="container"><UiSectionHeading eyebrow="Kiemelt partnerek" title="A háttérben is csapat dolgozik" />
      <div class="featured-sponsors"><article v-for="sponsor in featured" :key="sponsor.name"><span>Kiemelt partner</span><img :src="sponsor.logo" :alt="sponsor.description" width="320" height="120"></article></div>
    </div></section>


    <section class="section section--surface"><div class="container"><UiSectionHeading eyebrow="Közösségi partnerek" title="Helyi erő, közös ügy" />
      <div class="community-sponsors"><article v-for="sponsor in community" :key="sponsor.name"><img :src="sponsor.logo" :alt="sponsor.description" width="320" height="120"><span>{{ sponsor.name }}</span></article></div>
    </div></section>

    <section class="section sponsor-cta"><div class="container sponsor-cta__grid">
      <div><p class="eyebrow">Kapcsolódj hozzánk</p><h2>Legyen a támogatás látható érték.</h2>
      </div>
      <div><p>Együttműködésed az utánpótlás edzéseitől a sporttelep közösségi életéig több területen teremthet értéket.</p>
        <UiButton to="/kapcsolat">Támogatói kapcsolat</UiButton>
      </div></div></section>

  </div>
</template>

<style scoped>
.featured-sponsors{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--color-line);border-left:1px solid var(--color-line)}.featured-sponsors article{position:relative;display:grid;min-height:18rem;place-items:center;padding:2rem;border-right:1px solid var(--color-line);border-bottom:1px solid var(--color-line);background:#fbfaf5}.featured-sponsors article>span{position:absolute;top:1rem;left:1rem;color:#62695f;font-size:.65rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.featured-sponsors img{width:min(100%,17rem)}.community-sponsors{display:grid;grid-template-columns:repeat(5,1fr);border-top:1px solid var(--color-line);border-left:1px solid var(--color-line)}.community-sponsors article{display:grid;min-height:12rem;place-items:center;padding:1.25rem;border-right:1px solid var(--color-line);border-bottom:1px solid var(--color-line);background:#fbfaf5}.community-sponsors img{width:100%}.community-sponsors span{color:#62695f;font-size:.65rem;font-weight:700}.sponsor-cta__grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(3rem,8vw,8rem)}.sponsor-cta h2{max-width:10ch}.sponsor-cta__grid>div:last-child p{max-width:38rem;margin-bottom:2rem;color:var(--color-muted)}@media(max-width:900px){.community-sponsors{grid-template-columns:repeat(3,1fr)}}@media(max-width:767px){.featured-sponsors{grid-template-columns:1fr}.sponsor-cta__grid{grid-template-columns:1fr}}@media(max-width:520px){.community-sponsors{grid-template-columns:1fr 1fr}}
</style>
