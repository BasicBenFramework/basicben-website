/**
 * BasicBen Configuration
 *
 * See documentation for all available options.
 */

export default {
  // Write each page's HTML at build time, with its head tags, plus 404.html,
  // sitemap.xml and robots.txt — basicben.com is static on Cloudflare Pages.
  prerender: true,

  // Server options
  port: 3001,

  // CORS configuration
  // Auth is a bearer token, not a cookie, so credentialed CORS is not needed —
  // and the framework refuses `origin: '*'` together with `credentials: true`,
  // which browsers reject anyway.
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: false
  },

  // Body parser options
  bodyParser: {
    limit: '1mb'
  },

  // Static file serving
  static: {
    dir: 'public'
  },

  // Database configuration
  // db: {
  //   driver: 'sqlite',
  //   url: process.env.DATABASE_URL || './data.db'
  // }
}
