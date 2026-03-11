import { useTheme } from '../components/ThemeContext'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import { AppLayout } from '../layouts/AppLayout'
import { DocsLayout } from '../layouts/DocsLayout'

export function Database() {
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
        title="Database"
        subtitle="Adapters, migrations, seeding, and queries"
      />

      <div className="space-y-6">
        {/* Database Adapters */}
        <Card>
          <h2 className="text-lg font-semibold mb-2">Database Adapters</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            BasicBen supports multiple databases. Configure your adapter in <code>basicben.config.js</code>.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <div className="font-semibold text-sm">SQLite</div>
              <p className={`text-xs mt-1 ${t.muted}`}>Local file database (default)</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <div className="font-semibold text-sm">PostgreSQL</div>
              <p className={`text-xs mt-1 ${t.muted}`}>Traditional Postgres</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <div className="font-semibold text-sm">Turso</div>
              <p className={`text-xs mt-1 ${t.muted}`}>Edge SQLite (libSQL)</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <div className="font-semibold text-sm">PlanetScale</div>
              <p className={`text-xs mt-1 ${t.muted}`}>Serverless MySQL</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <div className="font-semibold text-sm">Neon</div>
              <p className={`text-xs mt-1 ${t.muted}`}>Serverless Postgres</p>
            </div>
          </div>

          <CodeBlock title="basicben.config.js - SQLite (default)">
{`export default {
  db: {
    driver: 'sqlite',
    url: './database.sqlite'
  }
}`}
          </CodeBlock>

          <CodeBlock title="basicben.config.js - Turso">
{`export default {
  db: {
    driver: 'turso',
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  }
}`}
          </CodeBlock>

          <CodeBlock title="basicben.config.js - PlanetScale">
{`export default {
  db: {
    driver: 'planetscale',
    url: process.env.DATABASE_URL
  }
}`}
          </CodeBlock>

          <CodeBlock title="basicben.config.js - Neon">
{`export default {
  db: {
    driver: 'neon',
    url: process.env.DATABASE_URL
  }
}`}
          </CodeBlock>

          <CodeBlock title="Install the driver you need">
{`# SQLite (default)
npm install better-sqlite3

# PostgreSQL
npm install pg

# Turso
npm install @libsql/client

# PlanetScale
npm install @planetscale/database

# Neon
npm install @neondatabase/serverless`}
          </CodeBlock>
        </Card>

        {/* Migrations */}
        <Card>
          <h2 className="text-lg font-semibold mb-2">Migrations</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Migrations let you version control your database schema. Each migration has an <code>up</code> function to apply changes and a <code>down</code> function to reverse them.
          </p>

          <CodeBlock title="Generate a migration">
{`npx basicben make:migration create_posts`}
          </CodeBlock>

          <CodeBlock title="migrations/001_create_posts.js">
{`export const up = (db) => {
  db.exec(\`
    CREATE TABLE posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      published INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  \`)
}

export const down = (db) => {
  db.exec('DROP TABLE posts')
}`}
          </CodeBlock>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npx basicben migrate</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Run pending migrations</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npx basicben migrate:rollback</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Undo last batch</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npx basicben migrate:fresh</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Drop all & re-run</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npx basicben migrate:status</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Show migration status</p>
            </div>
          </div>
        </Card>

        {/* Seeding */}
        <Card>
          <h2 className="text-lg font-semibold mb-2">Seeding</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Seeds populate your database with initial or test data. Create seed files in the <code>seeds/</code> directory. Seeds run in alphabetical order.
          </p>

          <CodeBlock title="Generate a seed file">
{`npx basicben make:seed users
# Creates: seeds/users.js`}
          </CodeBlock>

          <CodeBlock title="seeds/01_users.js">
{`import { db } from 'basicben'
import { hashPassword } from 'basicben/auth'

export async function seed() {
  const password = await hashPassword('password123')

  await (await db.table('users')).insert({
    name: 'Admin User',
    email: 'admin@example.com',
    password
  })

  await (await db.table('users')).insert({
    name: 'Test User',
    email: 'test@example.com',
    password
  })

  console.log('Seeded 2 users')
}`}
          </CodeBlock>

          <CodeBlock title="seeds/02_posts.js">
{`import { db } from 'basicben'

export async function seed() {
  const user = await (await db.table('users')).first()

  await (await db.table('posts')).insert({
    user_id: user.id,
    title: 'Welcome to BasicBen',
    content: 'Your first blog post!',
    published: 1
  })

  console.log('Seeded posts')
}`}
          </CodeBlock>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npx basicben seed</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Run all seeds</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npx basicben seed users</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Run specific seed</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npx basicben make:seed</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Generate seed file</p>
            </div>
            <div className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
              <code className="text-sm font-semibold">npx basicben db:seed</code>
              <p className={`text-xs mt-1 ${t.muted}`}>Alias for seed</p>
            </div>
          </div>
        </Card>

        {/* Query Builder */}
        <Card>
          <h2 className="text-lg font-semibold mb-2">Query Builder</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            The query builder provides a fluent API for database queries with built-in SQL injection protection.
          </p>

          <CodeBlock title="Basic queries">
{`import { db } from 'basicben'

// Get all users
const users = await (await db.table('users')).get()

// Find by ID
const user = await (await db.table('users')).find(1)

// Filter with where
const admins = await (await db.table('users'))
  .where('is_admin', true)
  .get()

// Chain multiple conditions
const results = await (await db.table('posts'))
  .where('published', true)
  .where('user_id', userId)
  .orderBy('created_at', 'DESC')
  .limit(10)
  .get()`}
          </CodeBlock>

          <CodeBlock title="Insert & Update">
{`// Insert a record
const result = await (await db.table('posts'))
  .insert({
    title: 'My Post',
    content: 'Hello world',
    user_id: 1
  })

console.log(result.lastInsertRowid) // New ID

// Update records
await (await db.table('posts'))
  .where('id', postId)
  .update({ title: 'Updated Title' })

// Delete records
await (await db.table('posts'))
  .where('id', postId)
  .delete()`}
          </CodeBlock>

          <CodeBlock title="Aggregates & Pagination">
{`// Count records
const count = await (await db.table('posts'))
  .where('published', true)
  .count()

// Check existence
const exists = await (await db.table('users'))
  .where('email', 'test@example.com')
  .exists()

// Paginate results
const page = await (await db.table('posts'))
  .orderBy('created_at', 'DESC')
  .paginate(1, 15)

// Returns: { data, total, page, perPage, totalPages }`}
          </CodeBlock>
        </Card>

        {/* Mass Assignment Protection */}
        <Card>
          <h2 className="text-lg font-semibold mb-2">Mass Assignment Protection</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Prevent users from setting fields they shouldn't (like <code>is_admin</code>) by using <code>only()</code> or <code>except()</code>.
          </p>

          <CodeBlock title="Whitelist with only()">
{`// Only allow these fields to be set
await (await db.table('users'))
  .only('name', 'email', 'bio')
  .insert(req.body)

// Extra fields in req.body are ignored
// { name: 'Bob', email: 'bob@test.com', is_admin: true }
// is_admin is silently dropped`}
          </CodeBlock>

          <CodeBlock title="Blacklist with except()">
{`// Block specific fields
await (await db.table('users'))
  .except('id', 'is_admin', 'created_at')
  .where('id', userId)
  .update(req.body)`}
          </CodeBlock>

          <CodeBlock title="In your models">
{`// src/models/User.js
export const User = {
  fillable: ['name', 'email', 'bio'],

  create: async (data) => {
    return (await db.table('users'))
      .only(...User.fillable)
      .insert(data)
  },

  update: async (id, data) => {
    return (await db.table('users'))
      .only(...User.fillable)
      .where('id', id)
      .update(data)
  }
}`}
          </CodeBlock>
        </Card>

        {/* Database Validation */}
        <Card>
          <h2 className="text-lg font-semibold mb-2">Database Validation</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Validate data against your database with <code>unique</code> and <code>exists</code> rules.
          </p>

          <CodeBlock title="Unique validation">
{`import { validate, rules } from 'basicben/validation'

// Check email is unique in users table
const result = await validate(req.body, {
  email: [rules.required, rules.email, rules.unique('users')]
})

// With custom column name
slug: [rules.unique('categories', 'slug')]

// Exclude current record (for updates)
email: [rules.unique('users', 'email', userId)]`}
          </CodeBlock>

          <CodeBlock title="Exists validation">
{`// Check foreign key exists
const result = await validate(req.body, {
  user_id: [rules.required, rules.exists('users')],
  category_id: [rules.required, rules.exists('categories')]
})

// With custom column
category: [rules.exists('categories', 'slug')]`}
          </CodeBlock>
        </Card>

        {/* Raw Queries */}
        <Card>
          <h2 className="text-lg font-semibold mb-2">Raw Queries</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            For complex queries, you can use raw SQL with parameterized queries.
          </p>

          <CodeBlock title="Using db directly">
{`import { db } from 'basicben'

// Parameterized queries (safe from SQL injection)
const posts = await db.all(
  'SELECT * FROM posts WHERE user_id = ? AND published = ?',
  [userId, true]
)

// Single row
const user = await db.get(
  'SELECT * FROM users WHERE email = ?',
  [email]
)

// Insert/Update/Delete
const result = await db.run(
  'INSERT INTO posts (title, user_id) VALUES (?, ?)',
  [title, userId]
)

// Transactions
await db.transaction(async (tx) => {
  await tx.run('UPDATE accounts SET balance = balance - ? WHERE id = ?', [100, fromId])
  await tx.run('UPDATE accounts SET balance = balance + ? WHERE id = ?', [100, toId])
})`}
          </CodeBlock>
        </Card>
      </div>
    </div>
  )
}
