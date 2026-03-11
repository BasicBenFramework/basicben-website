import { useTheme } from '../components/ThemeContext'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import { AppLayout } from '../layouts/AppLayout'
import { DocsLayout } from '../layouts/DocsLayout'

export function Validation() {
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
        title="Validation"
        subtitle="Request validation with built-in rules"
      />

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold mb-2">Basic Usage</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Validate request data using the <code>validate</code> function and built-in rules.
          </p>

          <CodeBlock title="Validating request body">
{`import { validate, rules } from 'basicben/validation'

export const store = async (req, res) => {
  const result = await validate(req.body, {
    title: [rules.required, rules.minLength(3), rules.maxLength(100)],
    email: [rules.required, rules.email],
    age: [rules.required, rules.number, rules.min(18)]
  })

  if (!result.valid) {
    return res.status(400).json({ errors: result.errors })
  }

  // Data is valid, continue...
}`}
          </CodeBlock>

          <CodeBlock title="Error response format">
{`{
  "errors": {
    "title": ["Title is required"],
    "email": ["Invalid email format"],
    "age": ["Must be at least 18"]
  }
}`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Available Rules</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            BasicBen includes commonly used validation rules out of the box.
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { rule: 'required', desc: 'Field must be present and not empty' },
              { rule: 'email', desc: 'Must be a valid email address' },
              { rule: 'number', desc: 'Must be a number' },
              { rule: 'string', desc: 'Must be a string' },
              { rule: 'boolean', desc: 'Must be true or false' },
              { rule: 'array', desc: 'Must be an array' },
              { rule: 'minLength(n)', desc: 'String must be at least n characters' },
              { rule: 'maxLength(n)', desc: 'String must be at most n characters' },
              { rule: 'min(n)', desc: 'Number must be at least n' },
              { rule: 'max(n)', desc: 'Number must be at most n' },
              { rule: 'regex(pattern)', desc: 'Must match the regex pattern' },
              { rule: 'in(values)', desc: 'Must be one of the given values' },
            ].map(({ rule, desc }) => (
              <div key={rule} className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
                <code className="text-sm font-semibold">{rule}</code>
                <p className={`text-xs mt-1 ${t.muted}`}>{desc}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Database Rules</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Validate against your database with <code>unique</code> and <code>exists</code> rules.
          </p>

          <CodeBlock title="Unique validation">
{`// Check if email is unique in users table
email: [rules.required, rules.email, rules.unique('users')]

// With custom column
slug: [rules.unique('categories', 'slug')]

// Exclude current record (for updates)
email: [rules.unique('users', 'email', currentUserId)]`}
          </CodeBlock>

          <CodeBlock title="Exists validation">
{`// Check if user_id exists in users table
user_id: [rules.required, rules.exists('users')]

// With custom column
category: [rules.exists('categories', 'slug')]`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Custom Rules</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Create custom validation rules for specific requirements.
          </p>

          <CodeBlock title="Creating a custom rule">
{`// Custom rule as a function
const isSlug = (value, field) => {
  if (!/^[a-z0-9-]+$/.test(value)) {
    return \`\${field} must only contain lowercase letters, numbers, and hyphens\`
  }
  return null // Return null if valid
}

// Use it in validation
const result = await validate(req.body, {
  slug: [rules.required, isSlug]
})`}
          </CodeBlock>

          <CodeBlock title="Async custom rule">
{`// Async rule for complex validation
const isAvailableUsername = async (value, field) => {
  const existing = await (await db.table('users'))
    .where('username', value)
    .first()

  if (existing) {
    return 'Username is already taken'
  }
  return null
}

const result = await validate(req.body, {
  username: [rules.required, isAvailableUsername]
})`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Optional Fields</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Fields without the <code>required</code> rule are optional. Other rules only run if the field has a value.
          </p>

          <CodeBlock title="Optional field validation">
{`const result = await validate(req.body, {
  name: [rules.required],           // Required
  bio: [rules.maxLength(500)],      // Optional, but if provided must be <= 500 chars
  website: [rules.url]              // Optional, but if provided must be a valid URL
})`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Nested Objects</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Validate nested objects using dot notation.
          </p>

          <CodeBlock title="Nested validation">
{`// Request body: { user: { name: 'John', email: 'john@example.com' } }

const result = await validate(req.body, {
  'user.name': [rules.required, rules.minLength(2)],
  'user.email': [rules.required, rules.email]
})`}
          </CodeBlock>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">Custom Error Messages</h2>
          <p className={`text-sm ${t.muted} mb-4`}>
            Override default error messages with custom ones.
          </p>

          <CodeBlock title="Custom messages">
{`const result = await validate(req.body, {
  email: [
    { rule: rules.required, message: 'Please enter your email' },
    { rule: rules.email, message: 'Please enter a valid email address' }
  ],
  password: [
    { rule: rules.required, message: 'Password is required' },
    { rule: rules.minLength(8), message: 'Password must be at least 8 characters' }
  ]
})`}
          </CodeBlock>
        </Card>
      </div>
    </div>
  )
}
