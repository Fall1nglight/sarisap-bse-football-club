import { copyFileSync, existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('../.output/public/', import.meta.url).pathname.replace(/^\/(.:\/)/, '$1')
const projectRoot = new URL('../', import.meta.url).pathname.replace(/^\/(.:\/)/, '$1')
const pages = [
  ['', 'Egy pálya.'],
  ['hirek', 'A klub történetei'],
  ['hirek/uj-ideny-kozos-celok', 'Új idény, közös célokkal'],
  ['hirek/utanpotlas-nyilt-edzes', 'Nyílt edzés a legkisebbeknek'],
  ['hirek/harom-pont-hazai-palyan', 'Három pont hazai pályán'],
  ['hirek/onkentes-nap-a-sporttelepen', 'Önkéntes nap a sporttelepen'],
  ['hirek/szurkoloi-delutan', 'Szurkolói délután három generációval'],
  ['hirek/megnyilt-az-uj-kluboldal', 'Megnyílt az új kluboldal bemutatója'],
  ['csapatok', 'Egy címer.'],
  ['csapatok/felnott', 'Felnőtt csapat'],
  ['csapatok/utanpotlas', 'Az első labdaérintéstől'],
  ['tamogatok', 'Akik velünk építik'],
  ['tao', 'Átlátható dokumentumtár'],
  ['kapcsolat', 'A pálya mellett'],
  ['404', 'Ez most mellé ment'],
]

const custom404 = join(root, '404', 'index.html')
if (!existsSync(custom404)) throw new Error('Hiányzik a saját 404 oldal statikus HTML-je.')
copyFileSync(custom404, join(root, '404.html'))

for (const [route, expectedText] of pages) {
  const htmlPath = route ? join(root, route, 'index.html') : join(root, 'index.html')
  if (!existsSync(htmlPath)) throw new Error(`Hiányzó statikus útvonal: /${route}`)
  const html = readFileSync(htmlPath, 'utf8')
  const required = [expectedText, '<h1', 'name="description"', 'rel="canonical"', 'noindex, nofollow']
  for (const value of required) {
    if (!html.includes(value)) throw new Error(`A /${route} HTML-jéből hiányzik: ${value}`)
  }
}

for (const [route, minimumCards] of [['', 3], ['hirek', 6]]) {
  const htmlPath = route ? join(root, route, 'index.html') : join(root, 'index.html')
  const html = readFileSync(htmlPath, 'utf8')
  const cardCount = (html.match(/class="news-card/g) || []).length
  if (cardCount < minimumCards) throw new Error(`A /${route} oldalon csak ${cardCount} hírkártya renderelődött.`)
}

for (const file of ['robots.txt', 'sitemap.xml']) {
  if (!existsSync(join(root, file))) throw new Error(`Hiányzó statikus SEO-fájl: ${file}`)
}

const robots = readFileSync(join(root, 'robots.txt'), 'utf8')
if (!robots.includes('Disallow: /')) throw new Error('A demó robots.txt nem tiltja az indexelést.')

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

const contentFiles = walk(join(projectRoot, 'content'))
for (const file of contentFiles) {
  const source = readFileSync(file, 'utf8')
  const references = source.matchAll(/(?:cover|image|logo|file):\s*(\/[^\s,}]+)/g)
  for (const match of references) {
    const asset = match[1]
    if (!asset || !existsSync(join(projectRoot, 'public', asset))) {
      throw new Error(`Hiányzó tartalmi asset: ${asset || 'ismeretlen'} (${file})`)
    }
  }
}

console.log(`Static output verified: ${pages.length} HTML routes, robots.txt, sitemap.xml, custom 404 and content assets.`)
