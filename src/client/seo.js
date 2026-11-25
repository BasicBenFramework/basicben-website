/**
 * What each public page tells search engines and link previews.
 *
 * `withHead` gives each route in src/routes/App.jsx its entry from this table
 * as the route's `head`. The framework does the rest: `basicben build` (with
 * `prerender: true`) writes the tags into every page's HTML, which is what
 * crawlers and share cards read, and the router keeps the tab title and tags
 * right as the visitor navigates.
 *
 * Adding a public page means adding it here as well as in App.jsx; a route
 * that is not listed here is marked noindex and left out of the sitemap.
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

/** createClientApp's `head`: the defaults every page starts from. */
export const HEAD = {
  title: SITE_NAME,
  titleTemplate: `%s — ${SITE_NAME}`,
  siteUrl: SITE_URL
}

const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL + '/',
  description: PAGES['/'].description
}

/** The routes, each with its `head` from PAGES; a route not in PAGES is noindex. */
export function withHead(routes) {
  const out = {}
  for (const [path, value] of Object.entries(routes)) {
    const page = PAGES[path]
    const head = page
      ? { ...page, fullTitle: true, ...(path === '/' ? { jsonLd: WEBSITE_JSON_LD } : {}) }
      : { noindex: true }
    out[path] = typeof value === 'function' ? { component: value, head } : { ...value, head }
  }
  return out
}
