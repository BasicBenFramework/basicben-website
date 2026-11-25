import { Link } from '@basicbenframework/core/client'
import { useTheme } from './ThemeContext'

/**
 * A button, or a link styled as one.
 *
 * `to` renders the router's Link (a real `<a href>`, so crawlers and
 * middle-clicks see it); `href` renders a plain `<a>` for other sites.
 * Anything that navigates should use one of the two rather than an onClick.
 */
export function Button({ variant = 'primary', children, className = '', to, href, ...props }) {
  const { t } = useTheme()
  const styles = {
    primary: `${t.btn} ${t.btnHover}`,
    secondary: t.btnSecondary,
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    ghost: `${t.muted} hover:opacity-70`
  }
  const classes = `inline-block text-sm font-medium rounded-full px-4 py-2 transition disabled:opacity-50 ${styles[variant]} ${className}`

  if (to) return <Link to={to} className={classes} {...props}>{children}</Link>
  if (href) return <a href={href} className={classes} {...props}>{children}</a>

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
