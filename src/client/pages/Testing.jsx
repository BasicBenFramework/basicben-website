import { useTheme } from '../components/ThemeContext'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import { AppLayout } from '../layouts/AppLayout'
import { DocsLayout } from '../layouts/DocsLayout'

export function Testing() {
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
        title="Testing"
        subtitle="Write and run tests with Vitest"
      />

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold mb-2">Overview</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            BasicBen uses Vitest for fast, modern testing. Tests are automatically discovered in files ending with <code>.test.js</code> or <code>.spec.js</code>.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npm run test</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Run tests once</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npm run test:watch</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Run tests in watch mode</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Writing Tests</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Create test files alongside your code or in a <code>tests/</code> directory.
          </p>

          <CodeBlock title="src/utils/helpers.test.js">
{`import { describe, it, expect } from 'vitest'
import { formatDate, slugify } from './helpers'

describe('formatDate', () => {
  it('formats a date correctly', () => {
    const date = new Date('2024-01-15')
    expect(formatDate(date)).toBe('January 15, 2024')
  })

  it('handles invalid dates', () => {
    expect(formatDate(null)).toBe('')
  })
})

describe('slugify', () => {
  it('converts text to a slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('This is a TEST')).toBe('this-is-a-test')
  })

  it('removes special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world')
  })
})`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Testing API Routes</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Test your API endpoints using the built-in test client.
          </p>

          <CodeBlock title="tests/api/posts.test.js">
{`import { describe, it, expect, beforeEach } from 'vitest'
import { testClient, resetDatabase } from 'basicben/testing'

describe('POST /api/posts', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  it('creates a post when authenticated', async () => {
    const { body, status } = await testClient
      .post('/api/posts')
      .auth(testUser)
      .send({
        title: 'Test Post',
        content: 'This is a test'
      })

    expect(status).toBe(201)
    expect(body.id).toBeDefined()
  })

  it('returns 401 when not authenticated', async () => {
    const { status } = await testClient
      .post('/api/posts')
      .send({ title: 'Test' })

    expect(status).toBe(401)
  })

  it('validates required fields', async () => {
    const { body, status } = await testClient
      .post('/api/posts')
      .auth(testUser)
      .send({})

    expect(status).toBe(400)
    expect(body.errors.title).toBeDefined()
  })
})`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Test Database</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Tests run against an isolated test database that resets between tests.
          </p>

          <CodeBlock title="Database helpers">
{`import { resetDatabase, seedDatabase, factory } from 'basicben/testing'

describe('User tests', () => {
  beforeEach(async () => {
    // Reset database to clean state
    await resetDatabase()

    // Optionally seed with test data
    await seedDatabase()
  })

  it('can create users with factory', async () => {
    // Create a user using the factory
    const user = await factory.user.create({
      name: 'Test User',
      email: 'test@example.com'
    })

    expect(user.id).toBeDefined()
  })

  it('can create multiple records', async () => {
    // Create 5 posts for a user
    const posts = await factory.post.createMany(5, {
      user_id: testUser.id
    })

    expect(posts).toHaveLength(5)
  })
})`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Mocking</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Use Vitest's built-in mocking for external dependencies.
          </p>

          <CodeBlock title="Mocking modules">
{`import { describe, it, expect, vi } from 'vitest'
import { sendEmail } from './email'

// Mock the email module
vi.mock('./email', () => ({
  sendEmail: vi.fn()
}))

describe('Registration', () => {
  it('sends welcome email after registration', async () => {
    await testClient
      .post('/api/auth/register')
      .send({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123'
      })

    expect(sendEmail).toHaveBeenCalledWith(
      'new@example.com',
      'Welcome!',
      expect.any(String)
    )
  })
})`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Code Coverage</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Generate code coverage reports to see what's tested.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npm run test:coverage</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Run tests with coverage</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npm run test:ui</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Open Vitest UI</p>
            </div>
          </div>

          <CodeBlock title="Coverage output">
{`----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
All files |   85.71 |    78.26 |   90.00 |   85.71 |
 auth.js  |  100.00 |   100.00 |  100.00 |  100.00 |
 posts.js |   75.00 |    66.67 |   80.00 |   75.00 |
----------|---------|----------|---------|---------|`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Testing Best Practices</h2>
          <div className="space-y-3 mt-4">
            {[
              { title: 'Isolate tests', desc: 'Each test should be independent and not rely on other tests' },
              { title: 'Reset state', desc: 'Use beforeEach to reset the database and any mocks' },
              { title: 'Test behavior', desc: 'Test what the code does, not how it does it' },
              { title: 'Use descriptive names', desc: 'Test names should describe the expected behavior' },
              { title: 'Keep tests fast', desc: 'Mock external services and use test databases' },
            ].map(({ title, desc }) => (
              <div key={title} className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
                <div className="font-semibold text-sm">{title}</div>
                <p className={`text-xs mt-1 ${t.muted}`}>{desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
