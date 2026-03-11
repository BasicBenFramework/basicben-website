import { useTheme } from './ThemeContext'

export function BackLink({ onClick, children }) {
  const { t } = useTheme()
  return (
    <button onClick={onClick} className={`text-sm ${t.muted} mb-4 hover:underline`}>
      &larr; {children}
    </button>
  )
}
