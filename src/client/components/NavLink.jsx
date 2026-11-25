import { Link } from '@basicbenframework/core/client'
import { useTheme } from './ThemeContext'

/** A header nav item: a link with `to`, a button with only `onClick` (log out). */
export function NavLink({ to, onClick, children, className = '' }) {
  const { t } = useTheme()
  const classes = `text-sm ${t.muted} hover:opacity-70 transition ${className}`
  if (to) return <Link to={to} className={classes}>{children}</Link>
  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
