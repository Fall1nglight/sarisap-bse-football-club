# Fejlesztési és telepítési útmutató

Ez a dokumentum a projekt helyi futtatásához, ellenőrzéséhez és Netlify
telepítéséhez szükséges technikai információkat tartalmazza. A tartalom
frissítésének leírása az [operator.md](operator.md) fájlban található.

## Követelmények és helyi indítás

A projekthez npm és Node.js szükséges. Helyi fejlesztéshez és Netlify-on is a
Node.js 22 használata javasolt; így ugyanaz a főverzió fut mindkét környezetben.

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

A fejlesztői oldal alapértelmezetten a `http://localhost:3000` címen érhető el.
Az `.env` fájl helyi beállításokat és titkos adatokat tartalmazhat, ezért a Git
figyelmen kívül hagyja. A verziókövetett `.env.example` csak kitöltendő minta.

## Parancsok

| Parancs | Feladat |
|---|---|
| `npm run dev` | Helyi fejlesztői szerver indítása |
| `npm run lint` | Kódstílus és gyakori hibák ellenőrzése |
| `npm run typecheck` | TypeScript típusellenőrzés |
| `npm run test` | Automatikus tesztek futtatása |
| `npm run build` | SSR/Nitro production build készítése |
| `npm run preview` | Az elkészült production build helyi előnézete |
| `npm run check` | Lint, típusellenőrzés, tesztek és build egymás után |

Telepítés előtt az `npm run check` futtatása javasolt.

## Környezeti változók

| Név | Kötelező | Leírás |
|---|---|---|
| `NUXT_PUBLIC_SITE_URL` | Élesben igen | Az oldal teljes, `https://` kezdetű nyilvános címe. A canonical URL-ek, a megosztási képek, a sitemap és a strukturált adatok használják. Ha nincs megadva, a kódban lévő Netlify próbacím az alapérték. |
| `NUXT_PUBLIC_SITE_INDEXABLE` | Ajánlott | Pontosan `false` értéknél tiltja a keresőmotorok indexelését. Ha hiányzik vagy más az értéke, az oldal indexelhető. Mintaadatok mellett mindig legyen `false`; éles induláskor tudatosan állítsd `true` értékre. |
| `NUXT_PUBLIC_GOOGLE_CALENDAR_ID` | A naptárhoz igen | A közös Google Naptár nyers azonosítója, például `...@group.calendar.google.com`. Ne írd át `%40` formára. A naptároldal és az automatikus MLSZ-szinkron is ezt használja. |
| `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_BASE64` | A szinkronhoz igen | A Google service account JSON-kulcsa base64-kódolva. Titkos Netlify-változóként kell tárolni, fájlba vagy Gitbe nem kerülhet. |
| `NODE_VERSION` | Netlify-on igen | Legyen `22`, hogy a build ugyanazzal a Node-főverzióval készüljön, mint amellyel a projektet ellenőrizzük. |

A helyi, nem titkos alapértékeket a `.env.example` tartalmazza. A Netlify-on a
változókat a projekt környezeti változói között kell beállítani. A Google-kulcsot
csak titkos értékként add meg.

## Működés röviden

A projekt Nuxt SSR/Nitro alkalmazás, ezért nem statikus exportként kell telepíteni.
A csapatoldalak a szerveren kérik le az MLSZ Adatbank adatait. Egy sikeres lekérés
egy órán át használható; átmeneti MLSZ-hiba esetén az utolsó sikeres adat legfeljebb
24 óráig jelenhet meg, elavultságra figyelmeztető jelzéssel. A gyorsítótár egy adott
szerverpéldány memóriájában él, tehát a Netlify külön példányai nem osztják meg.

A közös Google Naptárat a `netlify/functions/sync-calendar.mts` ütemezett funkció
óránként frissíti. Az MLSZ-források letöltése párhuzamos, a naptár módosításai
szándékosan egymás után futnak. A funkció csak a saját, MLSZ-ből létrehozott
eseményeit módosítja; a kézzel felvitt edzéseket és klubprogramokat nem.

## Netlify telepítés

1. Kapcsold össze a Netlify projektet a Git-tárral.
2. Build parancsnak az `npm run build` értéket használd. Ne használj
   `npm run generate` parancsot, mert a csapatoldalak szerveroldali MLSZ-lekérést
   igényelnek.
3. Állítsd be a fenti környezeti változókat, köztük a `NODE_VERSION=22` értéket.
4. Amíg mintaadat maradt az oldalon, az indexelés legyen kikapcsolva.
5. Indíts új production deployt, majd ellenőrizd legalább ezeket:
   `/`, `/hirek`, `/csapatok/nb-iii`, `/api/teams/nb-iii/matches`, `/naptar` és
   `/csapatok/felnott` (ennek a címe átirányít a jelenlegi felnőtt csapatra).
6. Ha a végleges domain már a Netlify projekthez tartozik és működik HTTPS-sel,
   állítsd a `NUXT_PUBLIC_SITE_URL` értékét erre a címre, majd telepíts újra.

Netlify buildhiba esetén, ha a napló `better-sqlite3` modult vagy
`Module did not self-register` hibát említ, először ellenőrizd a Node.js 22
beállítást, majd indíts `Retry without cache` újratelepítést.

## Google Naptár és MLSZ-szinkron beállítása

1. Hozz létre egy klubtulajdonú másodlagos Google Naptárt, például
   `Sárisápi BSE – Programok` néven, `Europe/Budapest` időzónával.
2. A beágyazott naptár megjelenítéséhez tedd nyilvánossá az események részleteit.
3. Egy Google Cloud projektben engedélyezd a Google Calendar API-t, hozz létre
   service accountot és egy JSON-kulcsot.
4. A célként használt naptárt oszd meg a service account e-mail-címével
   `Make changes to events` jogosultsággal. A naptár nyilvánossága és a service
   account szerkesztési joga két külön beállítás.
5. A naptárazonosítót állítsd be `NUXT_PUBLIC_GOOGLE_CALENDAR_ID` néven.
6. A JSON-kulcsot base64-kódold, és állítsd be Netlify secretté
   `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_BASE64` néven.
7. A következő production deploy után a Netlify Functions felületén futtasd le
   egyszer kézzel a `sync-calendar` funkciót. A további futás óránként történik.
8. Ellenőrizd külön, hogy a naptár látható-e a `/naptar` oldalon, és hogy az öt
   csapat MLSZ-mérkőzései megjelentek-e.

Sikertelen vagy gyanúsan üres MLSZ-válasz miatt a funkció nem töröl eseményeket.
Sikeresen beolvasott csapatnál viszont eltávolíthatja azt a jövőbeli, korábban
általa létrehozott mérkőzést, amely már nincs az MLSZ menetrendjében.

## Fontos projektfájlok

| Hely | Szerep |
|---|---|
| `content.config.ts` | A szerkeszthető tartalmak kötelező felépítése |
| `content/` | Hírek és kézzel karbantartott klubadatok |
| `shared/teams.ts` | Az öt csapat technikai alapadatai és MLSZ-forrásai |
| `server/utils/mlsz.ts` | MLSZ-adatok beolvasása és gyorsítótárazása |
| `server/utils/calendar-sync.ts` | MLSZ-mérkőzések összehangolása a naptárral |
| `netlify/functions/sync-calendar.mts` | Az óránként futó Netlify funkció |
| `public/` | Képek, logók, PDF-ek és más nyilvános fájlok |
| `DESIGN.md` | Arculati, reszponzív és akadálymentességi szabályok |

Az ikonok helyi csomagokból kerülnek az alkalmazásba. A Manrope és Barlow Condensed
betűkészletet a Nuxt Fonts a build során tölti le, majd az elkészült oldal helyben
szolgálja ki.
