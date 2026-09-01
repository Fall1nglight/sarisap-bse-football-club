<script setup lang="ts">
defineProps<{ items: Array<{ label: string, to?: string }> }>()
</script>

<template>
  <nav class="breadcrumbs" aria-label="Morzsanavigáció">
    <ol>
      <li v-for="(item, index) in items" :key="item.label">
        <NuxtLink v-if="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        <span v-else aria-current="page">{{ item.label }}</span>
        <Icon v-if="index < items.length - 1" name="lucide:chevron-right" aria-hidden="true" />
      </li>
    </ol>
  </nav>
</template>
