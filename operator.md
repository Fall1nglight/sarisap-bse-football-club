# Az oldal tartalmának kezelése

Ez az útmutató azoknak szól, akik híreket, csapatadatokat, képeket,
TAO-dokumentumokat vagy más klubinformációkat szeretnének frissíteni. Nem szükséges
programozni, de fontos a fájlnevek és a példák szerkezetének pontos követése.

## Mielőtt módosítasz valamit

Az oldalnak nincs külön szerkesztőfelülete. A tartalom a projekt fájljaiban van, és
a mentett változás csak az oldal újratelepítése után kerül ki az internetre. Ha nincs
jogosultságod a projekt közzétételéhez, végezd el a módosítást, majd kérd meg a
fejlesztőt, hogy ellenőrizze és publikálja.

Néhány egyszerű szabály:

- először készíts másolatot a módosítandó fájlról;
- a kulcsszavakat, például `title`, `name` vagy `season`, ne nevezd át;
- az idézőjeleket és a behúzásokat a környező sorok mintájára hagyd meg;
- tabulátor helyett szóközt használj;
- új kép vagy dokumentum neve legyen ékezet és szóköz nélküli;
- mentés után mindig kérj ellenőrzést, mielőtt a változás nyilvánossá válik.

## Új hír felvétele

1. Nyisd meg a `content/hirek` mappát.
2. Másold le az egyik meglévő `.md` fájlt.
3. Adj neki rövid, ékezet és szóköz nélküli nevet, például
   `uj-hir-cime.md`. Ez lesz a hír internetes címének vége.
4. A fájl tetején, a két `---` sor között írd át az adatokat.
5. A második `---` sor alatt cseréld le a hír szövegét. Új alcím `##` jellel
   kezdhető.

Példa:

```markdown
---
title: Nyílt edzés szombaton
description: Rövid összefoglaló, amely a keresőkben és megosztáskor jelenhet meg.
excerpt: Rövid kedvcsináló szöveg a hírkártyán.
publishedAt: 2026-09-12T09:00:00+02:00
category: Utánpótlás
author: Sárisápi BSE
cover: /images/club/nyilt-edzes.jpg
coverAlt: Gyerekek labdás edzésen a sárisápi pályán
featured: false
---

Ide kerül a hír bevezető szövege.

## Fontos tudnivalók

Ide kerülhet a további szöveg.
```

Az adatok jelentése:

- `title`: a hír címe;
- `description`: egy rövid, önmagában is érthető összefoglaló;
- `excerpt`: a hírek listájában látható kedvcsináló;
- `publishedAt`: megjelenési dátum és idő a példában látható alakban;
- `updatedAt`: nem kötelező; utólagos érdemi frissítés dátuma, ugyanilyen alakban;
- `category`: csak `Felnőtt`, `Utánpótlás`, `Egyesület` vagy `Közösség` lehet;
- `author`: a szerző vagy a szerkesztőség neve;
- `cover`: a borítókép helye;
- `coverAlt`: röviden írja le, mi látható a képen; ne a fájlnevet ismételje;
- `featured`: `true` esetén kiemelt hír, `false` esetén normál hír.

Egyszerre lehetőleg csak egy hír legyen `featured: true`. A korábbi kiemelt hírt
állítsd `false` értékre. `demo` nevű mezőt ne adj a hírhez: az oldal nem használja.

Meglévő hír javításához ugyanazt a fájlt szerkeszd. Ha a módosítás érdemben
megváltoztatja a cikket, adj hozzá vagy frissíts egy `updatedAt` sort. Hír
eltávolításakor a hozzá tartozó `.md` fájlt kell törölni; a borítóképet csak akkor
töröld, ha biztosan másik hír vagy oldal sem használja.

## Hírkép vagy más klubkép cseréje

A klub képei a `public/images/club` mappában vannak.

- Ha ugyanazzal a fájlnévvel cserélsz képet, a hivatkozásokat nem kell átírni.
- Ha új fájlnevet használsz, a hír `cover` sorában vagy az érintett oldal fájljában
  is át kell írni az útvonalat.
- A fájlban szereplő útvonal `/images/club/` résszel kezdődjön, például
  `/images/club/nyilt-edzes.jpg`.
- Csak olyan fotót tegyél közzé, amelynek használatához és az azon látható emberek
  megjelenítéséhez a klubnak joga van.

A főoldal több képe közvetlenül az `app/pages/index.vue` fájlban van megadva. Ezek
cseréjéhez, illetve más méretű vagy más nevű kép használatához kérd a fejlesztő
segítségét.

## Klubadatok és elérhetőségek

A `content/data/club.yml` fájl tartalmazza:

- a klub teljes és rövid nevét;
- az alapítás évét, a bemutatkozást és a történetet;
- a sporttelep nevét, címét és térképét;
- a kapcsolattartók nevét, szerepét, telefonszámát vagy e-mail-címét;
- a közösségi oldalak hivatkozásait.

Egy telefonszámnál a `value` az emberek által olvasható alak, a `href` pedig
`tel:+36...` formában a kattintható szám. E-mailnél a `href` `mailto:` kezdetű.
A térkép cseréjénél teljes beágyazható OpenStreetMap-címet használj.

## Csapatok stábja és edzésidőpontjai

A `content/data/teams.yml` fájlban öt, számmal azonosított csapat található:

| Azonosító | Csapat |
|---:|---|
| `0` | NB III. |
| `1` | T.I.O. felnőtt / Sárisápi BSE II. |
| `2` | U19 |
| `3` | U16 |
| `4` | U13 |

Az `id` értékét és a csapatok sorrendjét ne változtasd meg. A `staff` alatt a
stábtagok neve és feladata, a `training` sorban az edzésidőpontok vannak. Meglévő
bejegyzést másolj mintának:

```yaml
staff:
  - { name: Minta Elek, role: Edző }
training: [Kedd · 18:00–19:30, Péntek · 17:30–19:00]
```

Ha nincs megjelenítendő stáb vagy edzés, üres lista használható: `staff: []` vagy
`training: []`. A csapat nevét, bajnokságát és MLSZ-oldalát nem ez a fájl, hanem a
`shared/teams.ts` tartalmazza; ezek módosítását bízd a fejlesztőre.

A játékosok nevét és életkorát nem kell kézzel felvinni, mert az MLSZ Adatbankból
érkeznek.

## Mezszámok felülírása

A mezszámok a `content/data/mezszamok.md` fájlban adhatók meg. Minden játékos külön
sor legyen, ebben a formában:

```text
0: Barta Dániel: 1
1: Barta Dániel: 12
```

Az első szám a fenti táblázat szerinti csapatazonosító, utána a játékos MLSZ-ben
szereplő neve, végül a mezszám következik. A név kis- és nagybetűi, ékezetei és
kötőjelei eltérhetnek, de a biztos találat érdekében érdemes az MLSZ-ben látható
teljes nevet bemásolni. A mezszám legalább `1` legyen.

A `#` jellel kezdődő sor megjegyzés. A hibás, ismeretlen vagy több játékosra is
illő bejegyzést az oldal figyelmen kívül hagyja; ilyenkor `?` jelenik meg. Ha a
`mezszamok.md` hiányzik, a weboldal attól még működik. Üres mintához a
`content/data/mezszamok.example.md` használható.

## Támogatók frissítése

A támogatók adatai a `content/data/sponsors.yml`, logóik pedig a
`public/brand/sponsors` mappában vannak. Egy bejegyzés például:

```yaml
- { name: Minta Kft., level: Kiemelt, logo: /brand/sponsors/minta-kft.svg, description: Minta Kft. logója }
```

A `level` csak `Kiemelt` vagy `Közösségi` lehet. A `description` röviden nevezze
meg a logót. Új támogató esetén a logófájlt is fel kell tölteni, és a fájlnévnek
pontosan egyeznie kell a `logo` sor végével.

## TAO-dokumentum cseréje vagy felvétele

1. Ellenőrizd, hogy a PDF valóban a közzétenni kívánt, hivatalos dokumentum-e, és
   nem tartalmaz-e nyilvánosságra nem szánt adatot.
2. Adj neki egyértelmű, ékezet és szóköz nélküli fájlnevet, például
   `tao-2026-27-sportfejlesztesi-program.pdf`.
3. Másold a PDF-et a `public/documents/tao` mappába.
4. Nyisd meg a `content/data/tao.yml` fájlt, majd módosítsd a régi sort vagy másolj
   le egy sort új dokumentumhoz.

Példa:

```yaml
- { season: 2026/27, type: Sportfejlesztési program, date: 2026-08-14, file: /documents/tao/tao-2026-27-sportfejlesztesi-program.pdf, fileSize: 820 KB }
```

- `season`: az évad;
- `type`: a dokumentum közérthető neve;
- `date`: a dokumentum dátuma `év-hónap-nap` alakban;
- `file`: pontosan a feltöltött PDF neve elé írt `/documents/tao/` útvonal;
- `fileSize`: a PDF kerekített mérete, amelyet a fájl tulajdonságainál látsz.

Csere után nyisd meg a TAO oldalt, kattints a dokumentumra, és ellenőrizd, hogy a
megfelelő PDF nyílik meg. A projektben lévő jelenlegi TAO-fájlok mintadokumentumok
lehetnek, ezért éles indulás előtt mindegyiket ellenőrizni kell.

## A klubnaptár kezelése

A weboldal egy közös Google Naptárt mutat.

- A mérkőzéseket a rendszer óránként az MLSZ Adatbank alapján frissíti. Ezeket ne
  javítsd kézzel a Google Naptárban, mert a következő frissítés felülírhatja őket.
- Edzést, közösségi programot és más saját eseményt közvetlenül a Google Naptárban
  lehet felvenni. Ezeket az automatikus frissítés nem módosítja.
- Ha egy MLSZ-mérkőzés hibás, először az MLSZ Adatbank adatát kell javíttatni.
- Ha egy saját esemény nem látható a weboldalon, ellenőrizd, hogy ugyanabba a
  megosztott klubnaptárba került-e, és nyilvánosan látható-e.

## Közzététel utáni ellenőrzés

A módosítás publikálása után nézd meg telefonon és számítógépen is az érintett
oldalt. Ellenőrizd a szöveget, az ékezeteket, a képet vagy dokumentumot, a linkeket
és a dátumot. Ha az oldal telepítése hibával leáll, ne próbáld találomra átírni a
fájl szerkezetét: vond vissza az utolsó módosítást, vagy küldd el a hibaüzenetet a
fejlesztőnek.
