/**
 * BasicBen Configuration
 *
 * See documentation for all available options.
 */

export default {
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
