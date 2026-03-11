/**
 * BasicBen Configuration
 *
 * See documentation for all available options.
 */

export default {
  // Server options
  port: 3001,

  // CORS configuration
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
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
