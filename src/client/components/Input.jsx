import { useTheme } from './ThemeContext'

export function Input({ type = 'text', className = '', ...props }) {
  const { t } = useTheme()
  return (
    <input
      type={type}
      className={`w-full px-3 py-2 text-sm rounded-lg ${t.card} border ${t.border} focus:outline-none ${className}`}
      {...props}
    />
  )
}
