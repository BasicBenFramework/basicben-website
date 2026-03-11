import { useTheme } from './ThemeContext'

export function Card({ children, className = '' }) {
  const { t } = useTheme()
  return (
    <div className={`p-4 rounded-xl ${t.card} border ${t.border} ${className}`}>
      {children}
    </div>
  )
}
