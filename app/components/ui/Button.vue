<script setup lang="ts">
withDefaults(defineProps<{ to?: string, href?: string, variant?: 'primary' | 'secondary' | 'text' }>(), {
  to: undefined,
  href: undefined,
  variant: 'primary',
})
</script>

<template>
  <NuxtLink v-if="to" class="ui-button" :class="`ui-button--${variant}`" :to="to">
    <slot /> <Icon name="lucide:arrow-up-right" aria-hidden="true" />
  </NuxtLink>
  <a v-else-if="href" class="ui-button" :class="`ui-button--${variant}`" :href="href">
    <slot /> <Icon name="lucide:arrow-up-right" aria-hidden="true" />
  </a>
  <button v-else class="ui-button" :class="`ui-button--${variant}`" type="button">
    <slot />
  </button>
</template>
