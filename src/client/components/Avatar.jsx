import { useTheme } from './ThemeContext'

export function Avatar({ name, size = 'md' }) {
  const { dark } = useTheme()
  const sizes = { sm: 'w-6 h-6 text-xs', md: 'w-8 h-8 text-sm' }
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-medium ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}>
      {name[0].toUpperCase()}
    </div>
  )
}
