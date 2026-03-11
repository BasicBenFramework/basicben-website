import { useTheme } from './ThemeContext'

export function Textarea({ rows = 5, className = '', ...props }) {
  const { t } = useTheme()
  return (
    <textarea
      rows={rows}
      className={`w-full px-3 py-2 text-sm rounded-lg ${t.card} border ${t.border} focus:outline-none resize-none ${className}`}
      {...props}
    />
  )
}
