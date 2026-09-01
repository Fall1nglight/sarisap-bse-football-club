# Élesítési ellenőrzőlista

Az `NUXT_PUBLIC_SITE_INDEXABLE=true` csak az alábbi pontok lezárása után állítható be.

## Tartalom és jog

- [ ] Hivatalos klubnév, alapítási év, sporttelepnév, pontos cím és kapubejárat ellenőrizve.
- [ ] Minden demó játékos-, edző-, vezető-, telefon- és e-mail-adat lecserélve.
- [ ] Mérkőzések, eredmények, versenysorozat és tabella hivatalos forrásból frissítve.
- [ ] Támogatói nevek, logók, URL-ek és megjelenítési engedélyek rendelkezésre állnak.
- [ ] TAO PDF-ek hitelesek, közzétehetők, nem tartalmaznak véletlen személyes adatot.
- [ ] Impresszum, adatkezelési és szükséges jogi szövegek elkészültek.

## Képek és arculat

- [ ] A hat generált demóképet jogtiszta, valós klubfotók váltották fel, vagy a használatuk tudatosan jóváhagyott.
- [ ] Minden fotóhoz pontos, tartalmi alt szöveg tartozik.
- [ ] A végleges címer, favicon és 1200×630 px OG-kép elkészült.
- [ ] A támogatói logók világos és sötét környezetben is olvashatók.

## SEO és technika

- [ ] `NUXT_PUBLIC_SITE_URL` a HTTPS-es végleges domain.
- [ ] Canonical URL-ek, sitemap és robots.txt a végleges domainnel generálódnak.
- [ ] SportsOrganization, SportsTeam, NewsArticle, SportsEvent és breadcrumb JSON-LD ellenőrizve.
- [ ] Minden statikus hírrészlet szerepel a prerender és buildellenőrző listában.
- [ ] `npm ci`, `npm run lint`, `npm run typecheck` és `npm run generate` hibamentes.
- [ ] A tárhely saját `404.html` fájlt szolgál ki nem létező útvonalra.
- [ ] Nincs hydration warning, konzolhiba, törött kép, PDF vagy belső link.

## Kézi QA

- [ ] 320, 360, 390, 768, 1024, 1280 és 1440 px szélességen nincs túlcsordulás.
- [ ] Minden oldal világos és sötét témában ellenőrizve.
- [ ] Mobil menü, dropdown, témaváltó, kategóriaszűrő, TAO accordion és térképbetöltés billentyűzettel működik.
- [ ] Reduced-motion módban minden tartalom azonnal látható.
- [ ] Minden interaktív célterület legalább 44×44 px, a fókusz jól látható.
- [ ] Chrome Lighthouse: SEO 100, Accessibility ≥95, Performance ≥90, Best Practices ≥95.

## Indexelés engedélyezése

- [ ] A fentiek felelős jóváhagyása dokumentált.
- [ ] `NUXT_PUBLIC_SITE_INDEXABLE=true` beállítva az éles buildkörnyezetben.
- [ ] Új statikus build elkészült és a `robots.txt` már nem tartalmaz `Disallow: /` szabályt.
