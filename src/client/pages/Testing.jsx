import { useTheme } from '../components/ThemeContext'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'

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
        subtitle="Running tests with node:test, and what the framework leaves to you"
      />

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold mb-2">How Tests Run</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            <code>npm test</code> runs <code>basicben test</code>, which runs Node's built-in
            test runner, <code>node --test</code>. There is nothing to install. With no
            arguments it picks up <code>*.test.js</code>, <code>*.test.mjs</code> and{' '}
            <code>*.test.ts</code> files under <code>tests/</code> and <code>src/</code>; Node 24
            strips TypeScript types itself. Tests run with <code>NODE_ENV=test</code>.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npm test</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Run every test once</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npm test -- tests/posts.test.js</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Only the files or globs you name</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npm test -- --watch</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Re-run on change</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npm test -- --coverage</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Print a coverage report</p>
            </div>
          </div>

          <p className={`text-sm ${t.muted} mt-4`}>
            <code>test</code> is the only test script in <code>package.json</code>. The
            arguments after <code>--</code> are what npm forwards. Files you name replace the
            default patterns. <code>--watch</code> becomes Node's <code>--watch</code>,{' '}
            <code>--coverage</code> becomes <code>--experimental-test-coverage</code>, and any
            other flag goes to <code>node --test</code> as it is, so{' '}
            <code>npm test -- --test-name-pattern=login</code> works. <code>npx basicben test</code>{' '}
            does the same without npm.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">What the Framework Does Not Provide</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            There is no testing module. Alongside the package root there are nineteen entry
            points — <code>server</code>, <code>client</code>, <code>db</code>,{' '}
            <code>auth</code>, <code>validation</code>, <code>content</code>,{' '}
            <code>storage</code>, <code>mail</code>, <code>hooks</code>,{' '}
            <code>rate-limit</code>, <code>etag</code>, <code>webhooks</code>, and the{' '}
            <code>auth/*</code> and <code>storage/*</code> families —
            and not one of them is for tests. No test client, no request builder, no database
            reset helper, no model factories.
          </p>

          <p className={`text-sm ${t.muted} mb-4`}>
            Less of that is missing than it first appears. Controllers are functions, so call
            them. Models are objects, so call them. The query builder works against any SQLite
            file, so a test can have one of its own. The part you do have to arrange yourself is
            HTTP-level testing: exercising routing and middleware end to end means starting a
            server and using <code>fetch</code> against it.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">A Plain Test</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Test files sit next to the code they cover, or under <code>tests/</code> if you
            prefer them apart. <code>node:test</code> gives you <code>describe</code>,{' '}
            <code>it</code>, <code>before</code>, <code>after</code> and <code>mock</code>;{' '}
            <code>node:assert/strict</code> does the checking.
          </p>

          <CodeBlock title="src/utils/helpers.test.js">
{`import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { slugify } from './helpers.js'

describe('slugify', () => {
  it('converts text to a slug', () => {
    assert.equal(slugify('Hello World'), 'hello-world')
  })

  it('removes punctuation', () => {
    assert.equal(slugify('Hello! World?'), 'hello-world')
  })
})`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Testing a Controller</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            A controller action is an ordinary <code>async (req, res)</code> function, so a test
            can call it with objects you build by hand. Only the properties the action actually
            reads need to exist, which for most actions is <code>body</code>,
            <code>params</code> and whatever your auth middleware attaches.
          </p>

          <CodeBlock title="tests/PostController.test.js">
{`import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'
import { PostController } from '../src/controllers/PostController.js'

// res is whatever the controller calls. json(data, status) is the only
// method these paths use, so a mock function is enough.
function mockRes() {
  return { json: mock.fn() }
}

describe('PostController.store', () => {
  it('returns 422 when the body fails validation', async () => {
    const res = mockRes()

    await PostController.store({ body: { title: 'x' }, userId: 1 }, res)

    assert.equal(res.json.mock.callCount(), 1)
    const [data, status] = res.json.mock.calls[0].arguments
    assert.equal(status, 422)
    assert.ok(data.errors.title)
    assert.ok(data.errors.content)
  })
})`}
          </CodeBlock>

          <p className={`text-sm ${t.muted} mt-4`}>
            A validation failure returns before any query runs, so this test needs no database
            at all. Actions that do reach the database need the setup in the next section.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Testing Database Code</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Point the connection at a scratch SQLite file before the first query runs, and
            delete it afterwards. <code>resetDb()</code> drops the cached connection so the next
            call opens the file you just named, and creating the schema in{' '}
            <code>before</code> keeps each run independent of migration state.
          </p>

          <CodeBlock title="tests/posts.test.js">
{`import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, unlinkSync } from 'node:fs'
import { db, query, resetDb } from '@basicbenframework/core/db'

const TEST_DB = './tests/posts.test.sqlite'

function removeTestDb() {
  // WAL mode leaves two sidecar files next to the database.
  for (const suffix of ['', '-wal', '-shm']) {
    if (existsSync(TEST_DB + suffix)) unlinkSync(TEST_DB + suffix)
  }
}

before(async () => {
  removeTestDb()

  // basicben.config.js leaves db.url unset, so DATABASE_URL decides
  // the file. resetDb() clears any connection opened before this.
  process.env.DATABASE_URL = TEST_DB
  resetDb()

  await db.exec(\`
    CREATE TABLE posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      published INTEGER DEFAULT 0
    )
  \`)
})

after(async () => {
  await db.close()
  removeTestDb()
})

describe('posts', () => {
  it('inserts a row and reads it back', async () => {
    const result = await (await query('posts'))
      .only('title', 'published')
      .insert({ title: 'Hello', published: 1 })
    const post = await (await query('posts')).find(result.lastInsertRowid)

    assert.equal(post.title, 'Hello')
    assert.equal(post.published, 1)
  })

  it('refuses a write that names no columns', async () => {
    await assert.rejects(
      (await query('posts')).insert({ title: 'Unlisted' }),
      { code: 'MASS_ASSIGNMENT' }
    )
  })

  it('drops columns that only() does not list', async () => {
    await (await query('posts')).only('title').insert({ title: 'Draft', published: 1 })
    const post = await (await query('posts')).where('title', 'Draft').first()

    assert.equal(post.published, 0)
  })

  it('rolls back when the transaction callback throws', async () => {
    await assert.rejects(
      db.transaction(async (tx) => {
        await tx.run('INSERT INTO posts (title) VALUES (?)', ['Rolled back'])
        throw new Error('boom')
      }),
      { message: 'boom' }
    )

    assert.equal(await (await query('posts')).where('title', 'Rolled back').count(), 0)
  })
})`}
          </CodeBlock>

          <p className={`text-sm ${t.muted} mt-4`}>
            Since 0.9, <code>insert()</code> and <code>update()</code> throw{' '}
            <code>MASS_ASSIGNMENT</code> unless the chain names its columns with{' '}
            <code>only(...)</code>, or opts out with <code>unguarded()</code>. Test writes
            follow the same rule as app code. Raw <code>db.run()</code> and{' '}
            <code>tx.run()</code> are not affected.
          </p>

          <p className={`text-sm ${t.muted} mt-4`}>
            Two things to watch. The connection is one cached instance per process, resolved
            once from <code>db.url</code> in <code>basicben.config.js</code> falling back to{' '}
            <code>DATABASE_URL</code> — the config wins. A project that sets it there will have
            its tests write to the development database instead, so set the test path in the
            config or leave <code>db.url</code> unset. And SQLite will not bind JavaScript
            booleans, so test data uses <code>1</code> and <code>0</code> like everything else.
          </p>

          <p className={`text-sm ${t.muted} mt-4`}>
            Node runs each test file in its own process, several at once. Files that share one
            SQLite path will collide, so give each file its own database name, or keep database tests in a
            single file.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Coverage</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Coverage is built into Node, so there is no plugin to install.{' '}
            <code>--coverage</code> turns on <code>--experimental-test-coverage</code> and prints
            a table of line, branch and function coverage after the results. Node's own
            coverage flags pass straight through.
          </p>

          <CodeBlock title="Coverage, with and without thresholds">
{`npm test -- --coverage
npm test -- --coverage --test-coverage-lines=80`}
          </CodeBlock>

          <p className={`text-sm ${t.muted} mt-4`}>
            There is no test UI. <code>--ui</code> was a Vitest flag; <code>basicben test</code>{' '}
            prints a warning and ignores it.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Coming From Vitest</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Earlier versions of <code>basicben test</code> ran Vitest, which the framework
            never installed. A file that imports from <code>vitest</code> does not run under{' '}
            <code>node --test</code>, so it has to move over. The change is mostly mechanical.
          </p>

          <CodeBlock title="Vitest to node:test">
{`import { describe, it, expect, vi } from 'vitest'
// becomes
import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'

beforeAll / afterAll         →  before / after
expect(a).toBe(b)            →  assert.equal(a, b)
expect(a).toEqual(b)         →  assert.deepEqual(a, b)
expect(a).toBeDefined()      →  assert.ok(a !== undefined)
await expect(p).rejects...   →  await assert.rejects(p, ...)
vi.fn()                      →  mock.fn()`}
          </CodeBlock>

          <p className={`text-sm ${t.muted} mt-4`}>
            If you would rather keep Vitest, install it and set the <code>test</code> script to{' '}
            <code>vitest run</code>. <code>basicben test</code> will not run it for you.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Practices That Hold Up Here</h2>
          <div className="space-y-3 mt-4">
            {[
              {
                title: 'Give each test its own data',
                desc: 'There is no reset helper, so tests that assume an empty table break as soon as another test inserts. Create what you assert on, or assert on rows you inserted by name.'
              },
              {
                title: 'Test the model, not the query builder',
                desc: 'The builder has its own tests. What is worth covering is the SQL you wrote by hand, especially the joins the builder cannot express.'
              },
              {
                title: 'Cover validation failures',
                desc: 'The 422 path returns before any query, so it is the cheapest test in the suite and the one most likely to regress when a schema changes.'
              },
              {
                title: 'Keep the database out of unit tests',
                desc: 'Anything that is a pure function of its arguments should be tested as one. Reserve the SQLite fixture for code that genuinely queries.'
              },
              {
                title: 'Name tests after the behaviour',
                desc: 'The name is what you read when it fails, and "returns 422 when the body fails validation" tells you more at that moment than "store works".'
              },
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
