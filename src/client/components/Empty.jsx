import { useTheme } from './ThemeContext'

export function Empty({ children }) {
  const { t } = useTheme()
  return <p className={`text-center ${t.muted} py-12`}>{children}</p>
}
