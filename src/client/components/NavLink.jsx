import { useTheme } from './ThemeContext'

export function NavLink({ onClick, children, className = '' }) {
  const { t } = useTheme()
  return (
    <button onClick={onClick} className={`text-sm ${t.muted} hover:opacity-70 transition ${className}`}>
      {children}
    </button>
  )
}
