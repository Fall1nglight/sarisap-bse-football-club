<script setup lang="ts">
withDefaults(defineProps<{ eyebrow?: string, title: string, intro?: string, align?: 'start' | 'split' }>(), {
  eyebrow: undefined,
  intro: undefined,
  align: 'start',
})
</script>

<template>
  <header class="section-heading" :class="`section-heading--${align}`">
    <div>
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h2>{{ title }}</h2>
    </div>
    <p v-if="intro" class="section-heading__intro">{{ intro }}</p>
  </header>
</template>
