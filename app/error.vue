<script setup lang="ts">
defineProps<{ error: { statusCode?: number, statusMessage?: string } }>()

useSeoMeta({
  title: 'Az oldal nem található',
  description: 'A keresett oldal nem található a Sárisápi BSE weboldalán.',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <main id="main-content" class="error-page">
    <div class="container error-page__inner">
      <BrandMark class="error-page__mark" />
      <p class="eyebrow">{{ error.statusCode || 404 }} · eltévedt labda</p>
      <h1>Ez most mellé ment.</h1>
      <p>A keresett oldal nem érhető el. Térj vissza a pályára, vagy nézd meg a legfrissebb klubhíreket.</p>
      <div class="button-row">
        <UiButton to="/">Vissza a főoldalra</UiButton>
        <UiButton to="/hirek" variant="secondary">Hírek megnyitása</UiButton>
      </div>
    </div>
  </main>
</template>
