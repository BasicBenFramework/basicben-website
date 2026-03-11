import { useTheme } from '../components/ThemeContext'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import { AppLayout } from '../layouts/AppLayout'
import { DocsLayout } from '../layouts/DocsLayout'

export function Routing() {
  const { t } = useTheme()

  const CodeBlock = ({ children, title }) => (
    <div className="mt-4">
      {title && <div className={`text-xs font-medium mb-2 ${t.muted}`}>{title}</div>}
      <div className={`rounded-lg p-4 font-mono text-sm ${t.card} border ${t.border} overflow-x-auto`}>
        <pre className={t.text}>{children}</pre>
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader
        title="Routing"
        subtitle="API routes, controllers, and middleware"
      />

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold mb-2">Route Files</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Routes are defined in the <code>src/routes/</code> directory. Each file exports route definitions that map HTTP methods to handlers.
          </p>

          <CodeBlock title="src/routes/posts.js">
{`import { PostController } from '../controllers/PostController.js'
import { auth } from '../middleware/auth.js'

export default [
  { method: 'GET', path: '/api/posts', handler: PostController.index, middleware: [auth] },
  { method: 'GET', path: '/api/posts/:id', handler: PostController.show },
  { method: 'POST', path: '/api/posts', handler: PostController.store, middleware: [auth] },
  { method: 'PUT', path: '/api/posts/:id', handler: PostController.update, middleware: [auth] },
  { method: 'DELETE', path: '/api/posts/:id', handler: PostController.destroy, middleware: [auth] },
]`}
          </CodeBlock>

          <CodeBlock title="Generate a route file">
{`npx basicben make:route posts`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Controllers</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Controllers handle the business logic for your routes. They receive the request and return a response.
          </p>

          <CodeBlock title="src/controllers/PostController.js">
{`import { db } from 'basicben'

export const PostController = {
  // GET /api/posts
  index: async (req, res) => {
    const posts = await (await db.table('posts'))
      .where('user_id', req.user.id)
      .orderBy('created_at', 'DESC')
      .get()

    return res.json({ posts })
  },

  // GET /api/posts/:id
  show: async (req, res) => {
    const post = await (await db.table('posts')).find(req.params.id)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    return res.json({ post })
  },

  // POST /api/posts
  store: async (req, res) => {
    const { title, content } = req.body

    const result = await (await db.table('posts')).insert({
      title,
      content,
      user_id: req.user.id
    })

    return res.status(201).json({
      id: result.lastInsertRowid
    })
  },

  // PUT /api/posts/:id
  update: async (req, res) => {
    const { title, content } = req.body

    await (await db.table('posts'))
      .where('id', req.params.id)
      .where('user_id', req.user.id)
      .update({ title, content })

    return res.json({ success: true })
  },

  // DELETE /api/posts/:id
  destroy: async (req, res) => {
    await (await db.table('posts'))
      .where('id', req.params.id)
      .where('user_id', req.user.id)
      .delete()

    return res.json({ success: true })
  }
}`}
          </CodeBlock>

          <CodeBlock title="Generate a controller">
{`npx basicben make:controller Post`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Middleware</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Middleware runs before your route handler. Use it for authentication, logging, validation, etc.
          </p>

          <CodeBlock title="src/middleware/auth.js">
{`import { verifyToken } from 'basicben/auth'
import { db } from 'basicben'

export const auth = async (req, res, next) => {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = header.slice(7)

  try {
    const payload = await verifyToken(token)
    const user = await (await db.table('users')).find(payload.userId)

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}`}
          </CodeBlock>

          <CodeBlock title="Generate middleware">
{`npx basicben make:middleware auth`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Route Parameters</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Access URL parameters via <code>req.params</code> and query strings via <code>req.query</code>.
          </p>

          <CodeBlock title="Parameters and query strings">
{`// Route: /api/posts/:id
// URL: /api/posts/123?include=author

export const show = async (req, res) => {
  const { id } = req.params        // { id: '123' }
  const { include } = req.query    // { include: 'author' }

  // ...
}`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Request Body</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            JSON request bodies are automatically parsed and available on <code>req.body</code>.
          </p>

          <CodeBlock title="Accessing request body">
{`export const store = async (req, res) => {
  const { title, content, published } = req.body

  // Validate and use the data
  if (!title) {
    return res.status(400).json({ error: 'Title is required' })
  }

  // ...
}`}
          </CodeBlock>
        </Card>
      </div>
    </div>
  )
}
