/**
 * Prerender the public pages into dist/client, after `basicben build`.
 *
 * basicben.com is static (Cloudflare Pages), and the framework renders only in
 * the browser, so without this every URL served the same empty
 * `<div id="root">` titled "BasicBen App". This renders each page in
 * src/client/seo.js to HTML with its own head tags, and writes:
 *
 *   /               → index.html
 *   /docs           → docs.html
 *   /docs/routing   → docs/routing.html      (Pages serves x.html at /x)
 *   anything else   → 404.html, served with a 404 status
 *   sitemap.xml, robots.txt
 *
 * The client still mounts with createRoot and renders the page afresh, so the
 * app behaves exactly as before; the markup is for crawlers, link previews and
 * the first paint.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'dist/client')

const vite = await createServer({
  root,
  logLevel: 'warn',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false }
})

try {
  const { renderToString } = await import('react-dom/server')
  const { createElement } = await import('react')
  const { default: App } = await vite.ssrLoadModule('/src/routes/App.jsx')
  const { PAGES, SITE_URL, SITE_NAME, metaFor } = await vite.ssrLoadModule('/src/client/seo.js')

  const shell = readFileSync(join(outDir, 'index.html'), 'utf8')
  if (!shell.includes('<div id="root"></div>')) {
    throw new Error('dist/client/index.html has no empty #root — was it already prerendered? Run the build first.')
  }

  const render = (path) => {
    // The router reads its first location from window.location; nothing else
    // on these pages touches the browser during render.
    const url = new URL(path, SITE_URL)
    globalThis.window = { location: { pathname: url.pathname, search: '', hash: '', href: url.href, origin: url.origin } }
    try {
      return renderToString(createElement(App))
    } finally {
      delete globalThis.window
    }
  }

  const page = (path, outFile) => {
    const meta = metaFor(path)
    const markup = render(path)
    const html = shell
      .replace(/<title>[^<]*<\/title>/, headTags(meta, path === '/', SITE_URL, SITE_NAME))
      .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
    const file = join(outDir, outFile)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, html)
    console.log(`  prerendered ${path} → ${outFile}`)
  }

  const paths = Object.keys(PAGES)
  for (const path of paths) page(path, path === '/' ? 'index.html' : `${path.slice(1)}.html`)
  page('/404', '404.html')

  writeFileSync(join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${SITE_URL}${path === '/' ? '/' : path}</loc></url>`).join('\n')}
</urlset>
`)

  writeFileSync(join(outDir, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`)

  console.log(`  wrote sitemap.xml (${paths.length} URLs) and robots.txt`)
} finally {
  await vite.close()
}

function headTags(meta, isHome, siteUrl, siteName) {
  const tags = [`<title>${escape(meta.title)}</title>`]
  if (meta.description) tags.push(`<meta name="description" content="${escape(meta.description)}" />`)
  if (meta.noindex) tags.push('<meta name="robots" content="noindex" />')
  if (meta.canonical) tags.push(`<link rel="canonical" href="${meta.canonical}" />`)

  tags.push(
    `<meta property="og:site_name" content="${siteName}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`
  )
  if (meta.description) tags.push(`<meta property="og:description" content="${escape(meta.description)}" />`)
  if (meta.canonical) tags.push(`<meta property="og:url" content="${meta.canonical}" />`)
  tags.push('<meta name="twitter:card" content="summary" />')

  if (isHome) {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: `${siteUrl}/`,
      description: meta.description
    }
    tags.push(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`)
  }

  return tags.join('\n    ')
}

function escape(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
