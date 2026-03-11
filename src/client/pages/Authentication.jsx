import { useTheme } from '../components/ThemeContext'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import { AppLayout } from '../layouts/AppLayout'
import { DocsLayout } from '../layouts/DocsLayout'

export function Authentication() {
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
        title="Authentication"
        subtitle="JWT auth, password hashing, and protected routes"
      />

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold mb-2">Overview</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            BasicBen includes a complete JWT-based authentication system with password hashing, token generation, and middleware for protected routes.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <div className="font-semibold text-sm">JWT Tokens</div>
              <p className={`text-xs mt-1 ${t.muted}`}>Stateless authentication</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <div className="font-semibold text-sm">Bcrypt Hashing</div>
              <p className={`text-xs mt-1 ${t.muted}`}>Secure password storage</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <div className="font-semibold text-sm">Auth Middleware</div>
              <p className={`text-xs mt-1 ${t.muted}`}>Protect your routes</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Password Hashing</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Use bcrypt to securely hash and verify passwords.
          </p>

          <CodeBlock title="Hash and verify passwords">
{`import { hashPassword, verifyPassword } from 'basicben/auth'

// Hash a password (for registration)
const hashedPassword = await hashPassword('user-password')

// Verify a password (for login)
const isValid = await verifyPassword('user-password', hashedPassword)
// Returns true or false`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">JWT Tokens</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Generate and verify JWT tokens for stateless authentication.
          </p>

          <CodeBlock title="Generate and verify tokens">
{`import { generateToken, verifyToken } from 'basicben/auth'

// Generate a token (after successful login)
const token = await generateToken({ userId: user.id })

// Verify a token (in middleware)
try {
  const payload = await verifyToken(token)
  console.log(payload.userId) // The user ID from the token
} catch (error) {
  // Token is invalid or expired
}`}
          </CodeBlock>

          <CodeBlock title="Configure token expiration in basicben.config.js">
{`export default {
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '7d' // Token expires in 7 days
  }
}`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Registration</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Example registration endpoint that creates a user and returns a token.
          </p>

          <CodeBlock title="src/controllers/AuthController.js">
{`import { db } from 'basicben'
import { hashPassword, generateToken } from 'basicben/auth'
import { validate, rules } from 'basicben/validation'

export const AuthController = {
  register: async (req, res) => {
    // Validate input
    const result = await validate(req.body, {
      name: [rules.required, rules.minLength(2)],
      email: [rules.required, rules.email, rules.unique('users')],
      password: [rules.required, rules.minLength(8)]
    })

    if (!result.valid) {
      return res.status(400).json({ errors: result.errors })
    }

    // Create user
    const hashedPassword = await hashPassword(req.body.password)

    const { lastInsertRowid } = await (await db.table('users')).insert({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })

    // Get the created user
    const user = await (await db.table('users')).find(lastInsertRowid)

    // Generate token
    const token = await generateToken({ userId: user.id })

    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    })
  }
}`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Login</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Example login endpoint that verifies credentials and returns a token.
          </p>

          <CodeBlock title="Login handler">
{`import { verifyPassword, generateToken } from 'basicben/auth'

export const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body

    // Find user by email
    const user = await (await db.table('users'))
      .where('email', email)
      .first()

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const valid = await verifyPassword(password, user.password)

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = await generateToken({ userId: user.id })

    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    })
  }
}`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Auth Middleware</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Protect routes by requiring a valid JWT token.
          </p>

          <CodeBlock title="src/middleware/auth.js">
{`import { verifyToken } from 'basicben/auth'
import { db } from 'basicben'

export const auth = async (req, res, next) => {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const token = header.slice(7)
    const { userId } = await verifyToken(token)

    req.user = await (await db.table('users')).find(userId)

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}`}
          </CodeBlock>

          <CodeBlock title="Using auth middleware in routes">
{`import { auth } from '../middleware/auth.js'

export default [
  // Public route
  { method: 'GET', path: '/api/posts', handler: PostController.index },

  // Protected route - requires authentication
  { method: 'POST', path: '/api/posts', handler: PostController.store, middleware: [auth] },
]`}
          </CodeBlock>
        </Card>
      </div>
    </div>
  )
}
