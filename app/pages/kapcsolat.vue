<script setup lang="ts">
const { data: club } = await useAsyncData('contact-club', () => queryCollection('club').first())

interface ContactChannel {
  label: string
  title: string
  detail: string
  href: string
  icon: string
  external: boolean
}

const contactChannels = computed<ContactChannel[]>(() => {
  const channels: ContactChannel[] = []
  const phone = club.value?.contacts.find(contact => contact.href.startsWith('tel:'))
  const email = club.value?.contacts.find(contact => contact.href.startsWith('mailto:'))
  const facebook = club.value?.socials.find(social => social.name === 'Facebook')

  if (phone) {
    channels.push({ label: 'Telefon', title: phone.value, detail: phone.name, href: phone.href, icon: 'lucide:phone', external: false })
  }

  if (email) {
    channels.push({ label: 'E-mail', title: email.value, detail: email.name, href: email.href, icon: 'lucide:mail', external: false })
  }

  if (facebook) {
    channels.push({ label: 'Facebook', title: club.value?.shortName || 'Sárisápi BSE', detail: 'Hírek és közösségi bejegyzések', href: facebook.href, icon: 'simple-icons:facebook', external: true })
  }

  return channels
})

useSiteSeo({ title: 'Kapcsolat', description: 'A Sárisápi BSE egyesületi elérhetőségei, közösségi oldala és a Sárisápi Sporttelep helyszíne.' })
</script>

<template>
  <div v-if="club">
    <section class="section contact-section">
      <div class="container contact-layout">
        <header class="contact-intro">
          <p class="eyebrow">Elérhetőségek</p>
          <h2 id="contact-title">Beszéljünk.</h2>
          <p>Telefonon, e-mailben vagy a Facebook-oldalunkon is elérsz minket.</p>
        </header>
        <div class="contact-channels" aria-labelledby="contact-title">
          <a
            v-for="channel in contactChannels"
            :key="channel.label"
            class="contact-channel"
            :href="channel.href"
            :target="channel.external ? '_blank' : undefined"
            :rel="channel.external ? 'noopener noreferrer' : undefined"
            :aria-label="channel.external ? `${channel.label}: ${channel.title}, új lapon nyílik` : `${channel.label}: ${channel.title}`"
          >
            <span class="contact-channel__icon"><Icon :name="channel.icon" aria-hidden="true" /></span>
            <Icon class="contact-channel__arrow" name="lucide:arrow-up-right" aria-hidden="true" />
            <span class="contact-channel__copy">
              <small>{{ channel.label }}</small>
              <strong>{{ channel.title }}</strong>
              <span>{{ channel.detail }}</span>
            </span>
          </a>
        </div>
      </div>
    </section>

    <section class="section section--surface venue-section">
      <div class="container venue-grid">
        <div><p class="eyebrow">Helyszín</p><h2>{{ club.venue.name }}</h2><address>{{ club.venue.address }}</address><p>A Sárisápi Sporttelepen találkozik a csapat, az utánpótlás és a közösség, amely hétről hétre életben tartja a helyi futballt.</p></div>
        <div class="map-shell">
          <iframe :src="club.venue.mapUrl" title="A Sárisápi Sporttelep térképe" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.contact-layout,.venue-grid{display:grid;grid-template-columns:minmax(0,.5fr) minmax(0,1.5fr);gap:clamp(3rem,6vw,6rem)}.contact-intro{align-self:start}.contact-intro h2{max-width:8ch}.contact-intro>p:not(.eyebrow){max-width:28rem;margin-top:2rem;color:var(--color-muted)}.contact-channels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-block:1px solid var(--color-line)}.contact-channel{display:grid;min-width:0;min-height:15rem;grid-template-areas:"icon arrow" "copy copy";grid-template-columns:1fr auto;grid-template-rows:auto 1fr;align-items:start;gap:3rem 1rem;padding:2rem 1.5rem;color:inherit;text-decoration:none;transition:background-color var(--duration-fast)}.contact-channel+.contact-channel{border-left:1px solid var(--color-line)}.contact-channel__icon{grid-area:icon;color:var(--color-brand)}.contact-channel__icon svg,.contact-channel__arrow{width:1.35rem}.contact-channel__arrow{grid-area:arrow;color:var(--color-muted);transition:transform var(--duration-fast)}.contact-channel__copy{display:grid;min-width:0;align-self:end;grid-area:copy;gap:.5rem}.contact-channel__copy small{color:var(--color-muted);font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.contact-channel__copy strong{overflow-wrap:anywhere;font-family:var(--font-display);font-size:clamp(1.3rem,1.12rem + .45vw,1.7rem);line-height:1.05}.contact-channel__copy>span{color:var(--color-muted);font-size:.78rem;line-height:1.5}.contact-channel:hover{background:var(--color-surface)}.contact-channel:hover .contact-channel__arrow{transform:translate(.25rem,-.25rem)}.venue-grid{align-items:center;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:clamp(3rem,8vw,8rem)}.venue-grid h2{max-width:10ch}.venue-grid address{margin:2rem 0;font-weight:700}.venue-grid>div:first-child>p:not(.eyebrow){max-width:34rem;color:var(--color-muted)}.map-shell{overflow:hidden;min-height:28rem;border:1px solid var(--color-line);border-radius:var(--radius-md);background:var(--color-canvas)}.map-shell iframe{width:100%;height:32rem;border:0}@media(max-width:1050px){.contact-layout{grid-template-columns:1fr}.contact-intro{max-width:34rem}}@media(max-width:767px){.venue-grid{grid-template-columns:1fr}.contact-channels{grid-template-columns:1fr}.contact-channel{min-height:8rem;grid-template-areas:"icon copy arrow";grid-template-columns:2.25rem minmax(0,1fr) auto;grid-template-rows:1fr;align-items:center;gap:1rem;padding:1.5rem 0}.contact-channel+.contact-channel{border-top:1px solid var(--color-line);border-left:0}.contact-channel__copy{align-self:center}}
</style>
