<script setup lang="ts">
const { data: club } = await useAsyncData('footer-club', () => queryCollection('club').first())
</script>

<template>
  <footer v-if="club" class="site-footer">
    <div class="container site-footer__grid">
      <div>
        <BrandMark class="site-footer__mark" />
        <p class="site-footer__name">{{ club.name }}</p>
        <p class="supporting">A pályán együtt. A pályán túl közösség.</p>
      </div>
      <nav aria-label="Oldaltérkép">
        <p class="footer-title">Felfedezés</p>
        <NuxtLink to="/hirek">Hírek</NuxtLink>
        <NuxtLink to="/csapatok">Csapatok</NuxtLink>
        <NuxtLink to="/merkozesek">Mérkőzések</NuxtLink>
      </nav>
      <nav aria-label="Klubinformációk">
        <p class="footer-title">Klub</p>
        <NuxtLink to="/tamogatok">Támogatók</NuxtLink>
        <NuxtLink to="/tao">TAO dokumentumok</NuxtLink>
        <NuxtLink to="/kapcsolat">Kapcsolat</NuxtLink>
      </nav>
      <div>
        <p class="footer-title">{{ club.venue.name }}</p>
        <address class="supporting">{{ club.venue.address }}</address>
        <NuxtLink class="footer-contact" to="/kapcsolat">Útvonal és elérhetőségek</NuxtLink>
      </div>
    </div>
    <div class="container site-footer__bottom">
      <span>© {{ new Date().getFullYear() }} {{ club.shortName }}</span>
      <span>Készítette · <a href="https://www.linkedin.com/in/keruloszabolcs/">Kerülő Szabolcs</a></span>
    </div>
  </footer>
</template>
