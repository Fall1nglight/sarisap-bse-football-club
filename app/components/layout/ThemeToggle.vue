<script setup lang="ts">
const colorMode = useColorMode()
const isReady = computed(() => !colorMode.unknown)
const isDark = computed(() => isReady.value && colorMode.value === 'dark')
const label = computed(() => {
  if (!isReady.value) return 'Téma betöltése'
  return isDark.value ? 'Világos téma bekapcsolása' : 'Sötét téma bekapcsolása'
})
const title = computed(() => {
  if (!isReady.value) return 'Téma betöltése'
  return isDark.value ? 'Világos téma' : 'Sötét téma'
})

function toggleTheme() {
  if (!isReady.value) return
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <button
    class="icon-button theme-toggle"
    type="button"
    :disabled="!isReady"
    :aria-busy="!isReady ? 'true' : undefined"
    :aria-label="label"
    :title="title"
    @click="toggleTheme"
  >
    <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" aria-hidden="true" />
  </button>
</template>
