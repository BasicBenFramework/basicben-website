import { useTheme } from '../components/ThemeContext'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import { AppLayout } from '../layouts/AppLayout'
import { DocsLayout } from '../layouts/DocsLayout'

export function GettingStarted() {
  const { t } = useTheme()

  const devCommands = [
    { cmd: 'npm run dev', desc: 'Start development server' },
    { cmd: 'npm run build', desc: 'Build for production' },
    { cmd: 'npm run build -- --static', desc: 'Build client only (static hosts)' },
    { cmd: 'npm run start', desc: 'Run production server' },
    { cmd: 'npm run test', desc: 'Run tests with Vitest' },
  ]

  const makeCommands = [
    { cmd: 'npm run make:controller', desc: 'Generate a controller' },
    { cmd: 'npm run make:model', desc: 'Generate a model' },
    { cmd: 'npm run make:route', desc: 'Generate a route file' },
    { cmd: 'npm run make:migration', desc: 'Generate a migration' },
    { cmd: 'npm run make:middleware', desc: 'Generate middleware' },
    { cmd: 'npm run make:seed', desc: 'Generate a seeder' },
  ]

  const dbCommands = [
    { cmd: 'npm run migrate', desc: 'Run pending migrations' },
    { cmd: 'npm run migrate:rollback', desc: 'Roll back last batch' },
    { cmd: 'npm run migrate:fresh', desc: 'Drop all and re-run' },
    { cmd: 'npm run migrate:status', desc: 'Show migration status' },
    { cmd: 'npm run db:seed', desc: 'Run database seeders' },
  ]

  return (
    <div>
      <PageHeader title="Getting Started" />

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
          <div className={`rounded-lg p-4 font-mono text-sm ${t.card} border ${t.border} overflow-x-auto`}>
            <div className={t.muted}># Create a new project</div>
            <div>npx @basicbenframework/create my-app</div>
            <div className="mt-2" />
            <div className={t.muted}># Navigate to the project</div>
            <div>cd my-app</div>
            <div className="mt-2" />
            <div className={t.muted}># Start the development server</div>
            <div>npm run dev</div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Project Structure</h2>
          <div className={`rounded-lg p-4 font-mono text-sm ${t.card} border ${t.border} overflow-x-auto`}>
            <pre className={t.text}>{`my-app/
├── src/
│   ├── client/           # React frontend
│   │   ├── components/   # Reusable components
│   │   └── pages/        # Page components
│   ├── routes/           # API route files
│   ├── controllers/      # Business logic
│   ├── models/           # Database models
│   └── middleware/       # Route middleware
├── migrations/           # Database migrations
├── public/               # Static assets
└── basicben.config.js    # Framework config`}</pre>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">CLI Commands</h2>

          <h3 className={`text-sm font-medium mb-2 ${t.muted}`}>Development</h3>
          <div className="grid gap-2 sm:grid-cols-2 mb-4">
            {devCommands.map(({ cmd, desc }) => (
              <div key={cmd} className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
                <code className="text-sm font-semibold">{cmd}</code>
                <p className={`text-xs mt-1 ${t.muted}`}>{desc}</p>
              </div>
            ))}
          </div>

          <h3 className={`text-sm font-medium mb-2 ${t.muted}`}>Scaffolding</h3>
          <div className="grid gap-2 sm:grid-cols-2 mb-4">
            {makeCommands.map(({ cmd, desc }) => (
              <div key={cmd} className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
                <code className="text-sm font-semibold">{cmd}</code>
                <p className={`text-xs mt-1 ${t.muted}`}>{desc}</p>
              </div>
            ))}
          </div>

          <h3 className={`text-sm font-medium mb-2 ${t.muted}`}>Database</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {dbCommands.map(({ cmd, desc }) => (
              <div key={cmd} className={`rounded-lg p-3 ${t.card} border ${t.border}`}>
                <code className="text-sm font-semibold">{cmd}</code>
                <p className={`text-xs mt-1 ${t.muted}`}>{desc}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Resources</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/BasicBenFramework/core"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${t.btnSecondary} transition text-sm`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a
              href="https://basicben.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${t.btnSecondary} transition text-sm`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Documentation
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}
