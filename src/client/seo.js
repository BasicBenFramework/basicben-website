/**
 * What each public page tells search engines and link previews.
 *
 * One table, read twice: by `scripts/prerender.js`, which writes these tags
 * into the HTML of every page at build time (what crawlers and share cards
 * read), and by `useDocumentMeta` in the layout, which keeps the tab title and
 * the tags right as the visitor navigates client-side.
 *
 * Adding a public page means adding it here as well as in src/routes/App.jsx;
 * a route that is not listed here is not prerendered, not in the sitemap, and
 * is marked noindex.
 */

export const SITE_URL = 'https://basicben.com'
export const SITE_NAME = 'BasicBen'

const docs = (title, description) => ({ title: `${title} — BasicBen docs`, description })

export const PAGES = {
  '/': {
    title: 'BasicBen — a full-stack React framework with zero runtime dependencies',
    description: 'BasicBen is a convention-driven full-stack framework for React and Node.js: routing, controllers, migrations, JWT auth and validation, written from scratch with no runtime dependencies.'
  },
  '/docs': docs('Getting Started',
    'Create a BasicBen project, learn the folder layout, run the CLI commands and configure basicben.config.js.'),
  '/docs/routing': docs('Routing',
    'API routes, controllers, middleware, route groups, named and resource routes in BasicBen, plus the client router and deep links in production.'),
  '/docs/database': docs('Database',
    'BasicBen database drivers for SQLite, Postgres and Turso, plus migrations, seeding, the query builder, transactions and models.'),
  '/docs/authentication': docs('Authentication',
    'JWT tokens, password hashing, protected routes and roles in BasicBen, on the server and in React.'),
  '/docs/validation': docs('Validation',
    'Validate requests in BasicBen with the built-in rules, optional and nested fields, database rules, custom rules and custom error messages.'),
  '/docs/content': docs('Content & Markdown',
    'Write posts in Markdown: BasicBen renders and sanitizes on save with no Markdown dependency, and the pipeline can be extended.'),
  '/docs/storage': docs('Object Storage',
    'Upload files to Cloudflare R2, Amazon S3, MinIO, Backblaze B2 or DigitalOcean Spaces with one BasicBen driver and no AWS SDK.'),
  '/docs/extending': docs('Extending',
    'BasicBen hooks: where extensions live, the two kinds of hook, every hook the framework fires, and where each one runs — change behaviour without forking.'),
  '/docs/headless': docs('Headless API',
    'The read-only BasicBen content API at /api/v1: tokens, endpoints, query parameters, caching, webhooks, rate limits and CORS.'),
  '/docs/testing': docs('Testing',
    'Test a BasicBen app with node:test: how tests run, testing controllers and database code, coverage, and coming from Vitest.')
}

const NOT_FOUND = {
  title: 'Page not found — BasicBen',
  description: null,
  noindex: true
}

/** Path without a trailing slash, `/` itself excepted. */
function normalize(path) {
  const clean = String(path || '/').split(/[?#]/)[0]
  return clean.length > 1 ? clean.replace(/\/+$/, '') : '/'
}

/** Title, description, canonical URL and noindex for a path. */
export function metaFor(path) {
  const key = normalize(path)
  const page = PAGES[key]
  if (!page) return { ...NOT_FOUND, canonical: null }
  return { ...page, noindex: false, canonical: SITE_URL + (key === '/' ? '/' : key) }
}
