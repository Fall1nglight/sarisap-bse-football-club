# Sárisápi BSE — Nuxt kluboldal élő mérkőzésadatokkal

Magyar nyelvű, UI-first kluboldal Nuxt 4, Vue 3, TypeScript és Nuxt Content alapokon.
Az alkalmazás Nitro SSR-rel fut, így a csapatoldalak kéréskor frissülhetnek az MLSZ
meccsadataival.

> A repó bemutató adatokat tartalmaz. Alapértelmezetten minden build `noindex`, a
> kapcsolati adatok, eredmények, játékosok, támogatók és TAO-fájlok nem hivatalosak.

## Indítás

Követelmény: Node.js 22 LTS vagy újabb támogatott verzió és npm.

```bash
npm install
copy .env.example .env
npm run dev
```

A fejlesztői szerver alapértelmezetten a `http://localhost:3000` címen indul.

## Ellenőrzések és production build

```bash
npm run lint
npm run typecheck
npm run build
npm run check
```

Az `npm run build` Nitro production buildet készít. A csapatoldalak szerveroldalon kérik le
az MLSZ Adatbank sorsolását, óránkénti gyorsítótárral. Sikertelen frissítéskor az utolsó
sikeres adat legfeljebb 24 óráig jelenik meg figyelmeztetéssel.

Netlify-n a Nitro SSR buildet kell telepíteni; a deploy adapter automatikusan a Netlify
környezetéhez igazodik.

## Környezeti változók

```dotenv
NUXT_PUBLIC_SITE_URL=https://example.com
NUXT_PUBLIC_SITE_INDEXABLE=false
NUXT_PUBLIC_GOOGLE_CALENDAR_ID=example@group.calendar.google.com
```

- `NUXT_PUBLIC_SITE_URL`: canonical, Open Graph, sitemap és strukturált adatok alap URL-je.
- `NUXT_PUBLIC_SITE_INDEXABLE=false`: minden oldalon `noindex, nofollow`, a `robots.txt`
  pedig `Disallow: /` szabályt kap. Ez a biztonságos alapérték.
- `NUXT_PUBLIC_SITE_INDEXABLE=true`: csak a teljes élesítési ellenőrzőlista után állítható be.
- `NUXT_PUBLIC_GOOGLE_CALENDAR_ID`: a publikus, beágyazott klubnaptár azonosítója.

### Google Calendar és MLSZ-szinkron

1. Hozz létre egy klubtulajdonú másodlagos Google Naptárt `Sárisápi BSE – Programok` néven, `Europe/Budapest` időzónával, majd tedd nyilvánossá az eseményrészleteket.
2. A szerkesztőket a Google Calendarban add hozzá `Make changes to events` jogosultsággal. A weboldal nem biztosít szerkesztői felületet.
3. A Google Cloud projektben engedélyezd a Google Calendar API-t, hozz létre service accountot, majd annak e-mail-címét is add hozzá szerkesztőként ehhez a naptárhoz.
4. A service account JSON-kulcsát base64-kódold, és csak Netlify secretként állítsd be `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_BASE64` néven. A publikus naptárazonosító legyen `NUXT_PUBLIC_GOOGLE_CALENDAR_ID`.
5. A publikált deploy után a Netlify Functions felületén futtasd egyszer kézzel a `sync-calendar` funkciót. Ezután óránként összehangolja mind az öt csapat érvényes MLSZ-meccseit; a kézzel rögzített edzéseket és klubprogramokat nem módosítja.

A szinkron az MLSZ által kezelt meccseseményeket a következő futáskor felülírja. Sikeresen beolvasott csapatnál az MLSZ-ről eltűnt jövőbeli esemény törlődik, de sikertelen vagy üres forrás esetén nincs törlés.

Megjegyzés: a sitemap demó buildben is elkészül a technikai QA miatt, de a robots fájl
nem hirdeti, és a meta/robots szabályok tiltják az indexelést.

## Tartalom kezelése

### Új hír

1. Másold le valamelyik fájlt a `content/hirek` könyvtárban.
2. Adj neki URL-barát, ékezet nélküli fájlnevet, például `uj-hir-cime.md`.
3. Töltsd ki a kötelező frontmatter mezőket: `title`, `description`, `excerpt`,
   `publishedAt`, `category`, `author`, `cover`, `coverAlt`, `featured`, `demo`.
4. A dátum teljes ISO-formátumú legyen időzónával, például
   `2026-08-12T09:00:00+02:00`.
5. Futtasd az `npm run build` parancsot.

Kategóriák: `Felnőtt`, `Utánpótlás`, `Egyesület`, `Közösség`.

### Központi adatok

| Fájl | Tartalom |
|---|---|
| `content/data/club.yml` | klubnév, bemutatkozás, helyszín, elérhetőségek, közösségi linkek |
| `content/data/teams.yml` | felnőtt keret, stáb, edzések, hat utánpótlás-korosztály |
| `content/data/sponsors.yml` | támogatói szintek és logók |
| `content/data/tao.yml` | évadonkénti dokumentumok |

A mezőket a `content.config.ts` Zod-sémái validálják. Hiányzó kötelező mező, hibás
dátum vagy nem létező helyi asset esetén a build meghiúsul.

### Mezszámok felülírása

Ha egy játékos mezszámát csapatonként felül kell írni, másold a
`content/data/mezszamok.example.md` fájlt `content/data/mezszamok.md` néven, majd
soronként add meg: `csapatindex: játékos neve: mezszám`.

```text
0: Barta Dániel: 1
1: Barta Dániel: 12
```

Csapatindexek: `0` NB III., `1` T.I.O. felnőtt, `2` U19, `3` U16, `4` U13. A fájl
opcionális: hiánya, üres sora, `#` kezdetű megjegyzése vagy hibás bejegyzése nem okoz
hibát; ilyenkor a `teams.yml` eredeti mezszáma marad érvényben.

## Demóképek és cserehelyük

Az eredeti, AI-val generált, felirat és idegen logó nélküli demóképek a
`public/images/demo` könyvtárban vannak:

- `sporttelep-hero.png` — sporttelep és főoldali hero;
- `felnott-merkozes.png` — felnőtt mérkőzés;
- `utanpotlas-edzes.png` — utánpótlás-edzés;
- `csapatkor.png` — felnőtt csapatkör;
- `szurkolok.png` — családok és helyi szurkolók;
- `kozossegi-nap.png` — önkéntes közösségi nap.

A fájlok azonos néven cserélhetők valódi, jogtiszta klubfotókra. Más fájlnév esetén
frissíteni kell a megfelelő Markdown/YAML `cover` vagy `image` mezőjét. A megjelenítés
`NuxtImg` komponensen át, buildkor generált WebP/AVIF méretekkel történik.

Képgenerálási mód: beépített ImageGen, `photorealistic-natural`. A promptok közös
korlátai: magyar falusi amatőr futball dokumentarista hangulattal, természetes fény,
plain palazöld sportöltözet, anatómiai és pályageometriai helyesség, generált szöveg,
logó, márkajelzés és vízjel nélkül.

## Arculat és TypeUI

- A TypeUI Fundamentals és Minimal instrukciók projektlokálisan az `.agents/skills`
  könyvtárban találhatók; nem runtime függőségek.
- A végleges, projektspecifikus tokenek és minőségi kapuk a `DESIGN.md` fájlban vannak.
- A light/dark téma a rendszerbeállítást követi, majd a felhasználói választást
  `localStorage`-ban megőrzi.
- Az ikonok a helyi Lucide csomagból kerülnek a kliens bundle-be; nincs futásidejű
  Iconify API-hívás.
- A Manrope és Barlow Condensed betűfájlokat a Nuxt Fonts buildidőben tölti le és
  helyben szolgálja ki.

## TAO mintadokumentumok

A `public/documents/demo` könyvtár három, kétoldalas, kereshető szövegű PDF-et tartalmaz.
Mindegyiken többször látható a „NEM HIVATALOS MINTA” jelölés.

Újragenerálás:

```bash
python scripts/generate_demo_pdfs.py
```

Éles cserekor a PDF-et helyezd a `public/documents` könyvtárba, majd frissítsd a
`content/data/tao.yml` fájlnevet, dátumot és fájlméretet.

## Telepítés

1. Állítsd be a végleges `NUXT_PUBLIC_SITE_URL` értéket.
2. Hagyd `false` értéken az indexelési kapcsolót, amíg az összes mintaadatot le nem cserélted.
3. Futtasd: `npm ci && npm run check`.
4. Netlify SSR/Nitro kompatibilis környezetbe telepítsd a buildet; a csapatoldalaknak
   szerverfunkcióra van szükségük az MLSZ-adatok lekéréséhez.

Szolgáltató-specifikus konfiguráció, domain/DNS, analitika és backend nem része ennek a mérföldkőnek.
