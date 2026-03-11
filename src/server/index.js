/**
 * Server entry point (optional)
 *
 * Delete this file to use the default server.
 * Customize here for websockets, custom middleware, etc.
 */

import { createServer } from '@basicbenframework/core/server'

const app = await createServer()

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
