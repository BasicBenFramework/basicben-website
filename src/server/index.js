/**
 * Server entry point
 *
 * Customize here for websockets, custom middleware, etc.
 */

import { createServer } from '@basicbenframework/core/server'

// In production the built client lives in dist/client; in development Vite
// serves the app and this only needs to cover public/.
const staticDir = process.env.NODE_ENV === 'production' ? 'dist/client' : 'public'

const app = await createServer({
  // spa serves index.html for unmatched client routes, so deep links like
  // /docs/routing survive a direct request or a refresh instead of returning a
  // JSON 404. API paths and requests for files with an extension fall through
  // and still 404 correctly.
  static: { dir: staticDir, spa: true },

  // An explicit origin rather than '*': browsers reject a wildcard origin
  // combined with credentials, and this API should not be readable from
  // anywhere by default.
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  }
})

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
