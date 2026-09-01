# Sárisápi BSE — közösségi minimal design specification

Ez a fájl a projekt UI-jának kötelező forrása. A TypeUI Fundamentals interakciós,
tipográfiai, térköz- és akadálymentességi alapelveit a TypeUI Minimal visszafogott
szerkezetével ötvözi, de a klub számára kialakított saját vizuális nyelvet használja.

## Karakter

- Dokumentarista, helyi, hiteles; nem professzionális sportmárkát imitáló látvány.
- Editorial rács, erős tipográfiai hierarchia, kevés kártyadoboz és árnyék.
- A pályavonalak, a palazöld és az ásványarany csak irányt adnak; nem dekorálják túl a tartalmat.
- Tilos: kék–lila gradient, glassmorphism, lebegő blob, autoplay carousel, marquee,
  parallax, mindenre alkalmazott kapszula, alapstílusú böngészővezérlő és generikus stockfotó.

## Színtokenek

### Világos

- `--color-canvas: #f3f0e8` — meleg törtfehér oldalalap
- `--color-surface: #fbfaf5` — emelt, de árnyék nélküli felület
- `--color-ink: #20241f` — antracit főszöveg
- `--color-muted: #62695f` — támogató szöveg
- `--color-line: #c9cec3` — szerkezeti vonal
- `--color-brand: #315c49` — palazöld klubszín
- `--color-brand-strong: #224536` — interakció és kontraszt
- `--color-accent: #9b7938` — ásványarany akcentus
- `--color-on-brand: #fffdf7`

### Sötét

- `--color-canvas: #151a17`
- `--color-surface: #1d2521`
- `--color-ink: #edf0e9`
- `--color-muted: #aab4aa`
- `--color-line: #3a463f`
- `--color-brand: #8fbba3`
- `--color-brand-strong: #b6d4c3`
- `--color-accent: #d4b36e`
- `--color-on-brand: #142018`

Állapotok: siker `#36724f`, figyelmeztetés `#a76d20`, veszély `#a9483d`. Színt soha nem
használunk egyetlen információhordozóként.

## Tipográfia

- Display: `Barlow Condensed`, 600/700. Címsorok és tabuláris eredményszámok.
- Törzs: `Manrope`, 400/500/600/700.
- H1: `clamp(3.2rem, 9vw, 7.75rem)`, line-height `.86`, letter-spacing `-.035em`.
- Belső oldali H1: `clamp(2.8rem, 7vw, 6rem)`.
- H2: `clamp(2.25rem, 5vw, 4.75rem)`, line-height `.94`.
- H3: `clamp(1.5rem, 3vw, 2.4rem)`; kártyacímet H4 jelöl.
- Törzs: `clamp(1rem, .96rem + .2vw, 1.125rem)`, line-height `1.7`.
- Meta és eyebrow: 12–14 px, 700, uppercase, `.11em` tracking.
- Egy oldalon egy H1. Minden fő szakasz H2. Kártyák címe H4, 18–22 px.

## Térköz és rács

- 4 px alapegység. Térközök: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Tartalom maximum 1280 px; oldalsó padding `clamp(20px, 4vw, 64px)`.
- Szakaszpadding `clamp(72px, 10vw, 144px)`; kompakt szakasz ennek legfeljebb kétharmada.
- Cím és bekezdés között minimum 24–32 px. Szakasz külső tere mindig nagyobb a belső gapnél.
- Az aszimmetria tördeléssel, képvágással és vonalakkal jön létre, nem véletlen margókkal.

## Formák és mélység

- Kis rádiusz 4 px, alap 8 px, nagy 16 px. Kapszula csak státusz- és kategóriacímkéhez.
- Alapértelmezett árnyék nincs. Emeléshez felületszín, 1 px vonal és ritkán lágy árnyék használható.
- A címer és pályavonal-motívum geometrikus, vonalalapú, saját SVG.

## Komponensállapotok

- Minden interaktív célterület minimum 44×44 px.
- Fókusz: 3 px ásványarany outline, 3 px offset; billentyűzettel mindig látható.
- Gomb: alap/hover/active/focus/disabled állapot, egységes magasság, nem törő címke.
- Link: navigációban szöveges, tartalomban aláhúzott. Aktív menüpontot vonal és `aria-current` jelzi.
- Kártya hover: legfeljebb 1.025 képzoom, 4 px nyílmozgás, keretszínváltás.
- Mobilmenü valódi modális dialógus, Escape-kezeléssel és fókuszvisszaadással.
- Táblázat 720 px alatt vízszintesen gördülő, feliratozott régió.

## Motion

- Idők: gyors 160 ms, alap 220 ms, belépés 520 ms; ease `cubic-bezier(.22,1,.36,1)`.
- Csak `transform` és `opacity` animálható.
- Hero sorrend: címke, cím, szöveg, CTA 70 ms lépcsőkkel; összesen legfeljebb 650 ms.
- Reveal: egyszeri, 14 px függőleges elmozdulás; csak kliensoldali inicializálás után rejt.
- LCP-kép azonnal látható. Nincs tartós vagy végtelen dekoratív mozgás.
- `prefers-reduced-motion: reduce` esetén nincs belépő, scroll vagy hover-transzformáció.

## Minőségi kapuk

- 320 px-en nincs vízszintes túlcsordulás; ellenőrzés 320/360/390/768/1024/1280/1440 px-en.
- WCAG 2.2 AA kontraszt, megfelelő alt szöveg, skip link, szemantikus landmarkok és heading-sorrend.
- Képnek rögzített képaránya és mérete van; hero eager/preload, a többi lazy.
- JavaScript nélkül minden fő tartalom látható; reduced motion alatt azonnal megjelenik.
- Külső runtime font-, ikon- vagy képigény nincs; TypeUI nem runtime dependency.
