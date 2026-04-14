import fs from 'node:fs'
import path from 'node:path'

const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://stephen-taipei.github.io/awesome-free-mini-tools-1000').replace(/\/$/, '')
const today = new Date().toISOString().split('T')[0]
const rootDir = path.resolve(process.cwd())
const registryPath = path.join(rootDir, 'src/tools/registry.ts')
const publicDir = path.join(rootDir, 'public')

const registry = fs.readFileSync(registryPath, 'utf8')
const toolPaths = [...registry.matchAll(/path:\s*'([^']+)'/g)].map((match) => match[1])

const urls = [`${siteUrl}/`, ...toolPaths.map((toolPath) => `${siteUrl}/?tool=${encodeURIComponent(toolPath)}`)]
const recentUrls = [`${siteUrl}/`, ...toolPaths.slice(0, 50).map((toolPath) => `${siteUrl}/?tool=${encodeURIComponent(toolPath)}`)]

const toXml = (list) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${list
    .map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
    .join('\n')}\n</urlset>\n`

fs.mkdirSync(publicDir, { recursive: true })
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), toXml(urls), 'utf8')
fs.writeFileSync(path.join(publicDir, 'news-sitemap.xml'), toXml(recentUrls), 'utf8')

console.log(`Generated sitemap.xml with ${urls.length} URLs.`)

