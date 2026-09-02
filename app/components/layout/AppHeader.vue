<script setup lang="ts">
import { teamNavigation } from '~~/shared/teams'

const route = useRoute()
const isOpen = ref(false)
const isTeamMenuOpen = ref(route.path === '/csapatok' || route.path.startsWith('/csapatok/'))
const menuButton = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)

const nav = [
  { label: 'Főoldal', to: '/' },
  { label: 'Hírek', to: '/hirek' },
  { label: 'Támogatók', to: '/tamogatok' },
  { label: 'TAO', to: '/tao' },
  { label: 'Kapcsolat', to: '/kapcsolat' },
]

const teamNav = teamNavigation

function closeMenu() {
  isOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    closeMenu()
    nextTick(() => menuButton.value?.focus())
  }
}

watch(() => route.fullPath, () => {
  closeMenu()
  isTeamMenuOpen.value = route.path === '/csapatok' || route.path.startsWith('/csapatok/')
})
watch(isOpen, async (open) => {
  if (!import.meta.client) return
  document.body.classList.toggle('menu-open', open)
  if (open) {
    await nextTick()
    panel.value?.querySelector<HTMLElement>('a')?.focus()
  }
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.classList.remove('menu-open')
})

function isCurrent(to: string) {
  return to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <NuxtLink class="site-logo" to="/" aria-label="Sárisápi BSE főoldal">
        <BrandMark class="site-logo__mark" />
        <span class="site-logo__wordmark"><strong>Sárisápi</strong><small>Bányász SE</small></span>
      </NuxtLink>

      <nav class="desktop-nav" aria-label="Fő navigáció">
        <NuxtLink v-for="item in nav.slice(0, 2)" :key="item.to" :to="item.to" :aria-current="isCurrent(item.to) ? 'page' : undefined">
          {{ item.label }}
        </NuxtLink>
        <div class="nav-dropdown">
          <NuxtLink to="/csapatok" :aria-current="isCurrent('/csapatok') ? 'page' : undefined">
            Csapatok <Icon name="lucide:chevron-down" aria-hidden="true" />
          </NuxtLink>
          <div class="nav-dropdown__panel">
            <NuxtLink v-for="item in teamNav" :key="item.to" :to="item.to" :aria-current="isCurrent(item.to) ? 'page' : undefined">
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>
        <NuxtLink to="/naptar" :aria-current="isCurrent('/naptar') ? 'page' : undefined">Naptár</NuxtLink>
        <NuxtLink v-for="item in nav.slice(2)" :key="item.to" :to="item.to" :aria-current="isCurrent(item.to) ? 'page' : undefined">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="site-header__actions">
        <LayoutThemeToggle />
        <button
          ref="menuButton"
          class="icon-button menu-button"
          type="button"
          :aria-expanded="isOpen"
          aria-controls="mobile-navigation"
          :aria-label="isOpen ? 'Menü bezárása' : 'Menü megnyitása'"
          @click="isOpen = !isOpen"
        >
          <Icon :name="isOpen ? 'lucide:x' : 'lucide:menu'" aria-hidden="true" />
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="menu">
        <div v-if="isOpen" id="mobile-navigation" class="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobil navigáció">
          <button class="mobile-menu__backdrop" type="button" aria-label="Menü bezárása" @click="closeMenu" />
          <nav ref="panel" class="mobile-menu__panel" aria-label="Mobil navigáció">
            <div class="mobile-menu__top">
              <span>Menü</span>
              <button class="icon-button" type="button" aria-label="Menü bezárása" @click="closeMenu">
                <Icon name="lucide:x" aria-hidden="true" />
              </button>
            </div>
            <NuxtLink
              v-for="item in nav.slice(0, 2)"
              :key="item.to"
              class="mobile-menu__link"
              :to="item.to"
              :aria-current="isCurrent(item.to) ? 'page' : undefined"
            >
              {{ item.label }}
            </NuxtLink>
            <button
              class="mobile-menu__link mobile-menu__group-toggle"
              :class="{ 'is-current': isCurrent('/csapatok') }"
              type="button"
              :aria-expanded="isTeamMenuOpen"
              aria-controls="mobile-team-navigation"
              @click="isTeamMenuOpen = !isTeamMenuOpen"
            >
              <span>Csapatok</span>
              <Icon name="lucide:chevron-down" aria-hidden="true" />
            </button>
            <div v-show="isTeamMenuOpen" id="mobile-team-navigation" class="mobile-menu__submenu">
              <NuxtLink
                v-for="item in teamNav"
                :key="item.to"
                class="mobile-menu__link mobile-menu__sub-link"
                :to="item.to"
                :aria-current="isCurrent(item.to) ? 'page' : undefined"
              >
                {{ item.label }}
              </NuxtLink>
            </div>
            <NuxtLink class="mobile-menu__link" to="/naptar" :aria-current="isCurrent('/naptar') ? 'page' : undefined">
              Naptár
            </NuxtLink>
            <NuxtLink
              v-for="item in nav.slice(2)"
              :key="item.to"
              class="mobile-menu__link"
              :to="item.to"
              :aria-current="isCurrent(item.to) ? 'page' : undefined"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>
