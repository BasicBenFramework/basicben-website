import { usePath } from '@basicbenframework/core/client'
import { useTheme } from '../components/ThemeContext'
import { Button } from '../components/Button'

export function NotFound() {
  const { t } = useTheme()
  const path = usePath()

  return (
    <div className="py-16 text-center">
      <p className={`text-sm font-mono ${t.subtle}`}>404</p>
      <h1 className="text-2xl font-bold mt-2">Page not found</h1>
      <p className={`text-sm mt-2 ${t.muted}`}>
        Nothing lives at <code className="font-mono">{path}</code>.
      </p>

      <div className="flex items-center justify-center gap-3 mt-6">
        <Button to="/">Go home</Button>
        <Button variant="secondary" to="/docs">Read the docs</Button>
      </div>
    </div>
  )
}
