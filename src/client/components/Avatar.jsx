import { useTheme } from './ThemeContext'

export function Avatar({ name, size = 'md' }) {
  const { dark } = useTheme()
  const sizes = { sm: 'w-6 h-6 text-xs', md: 'w-8 h-8 text-sm' }
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-medium bg-white text-black light:bg-black light:text-white`}>
      {(name?.trim()?.[0] ?? '?').toUpperCase()}
    </div>
  )
}
