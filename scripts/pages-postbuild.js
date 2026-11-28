/**
 * After `npm run build` on Cloudflare Pages: drop dist/client/.basicben.
 *
 * The prerender writes the clean app shell and the route patterns there for
 * the framework's Node server, which uses them to answer unknown paths with a
 * real 404. basicben.com is static on Pages and has no server, so nothing
 * reads them, and Pages would serve them publicly.
 *
 * Pages sets CF_PAGES=1 during its builds. Elsewhere (Docker, `npm start`)
 * the server needs the folder, so it stays.
 */

import { rmSync } from 'node:fs'

if (process.env.CF_PAGES) {
  rmSync(new URL('../dist/client/.basicben', import.meta.url), { recursive: true, force: true })
  console.log('Removed dist/client/.basicben (not needed on Cloudflare Pages)')
}
