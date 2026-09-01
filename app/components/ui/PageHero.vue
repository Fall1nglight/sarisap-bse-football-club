<script setup lang="ts">
defineProps<{ eyebrow: string, title: string, intro: string }>()
</script>

<template>
  <section class="page-hero">
    <div class="container" data-reveal>
      <p class="eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p class="page-hero__intro">{{ intro }}</p>
      <div v-if="$slots.default" class="page-hero__actions"><slot /></div>
    </div>
  </section>
</template>

<style scoped>
.page-hero__actions { margin-top: 2rem; }
</style>
