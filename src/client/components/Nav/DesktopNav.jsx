import { useTheme } from '../ThemeContext'
import { NavLink } from '../NavLink'
import { DarkModeToggle } from './DarkModeToggle'

export function DesktopNav({ navigate }) {
  const { t, dark, setDark } = useTheme()

  return (
    <div className="hidden sm:flex items-center gap-2">
      <NavLink onClick={() => navigate('/docs')}>Docs</NavLink>

      <div className={`w-px h-5 mx-1 ${dark ? 'bg-white/20' : 'bg-black/20'}`} />

      <DarkModeToggle dark={dark} setDark={setDark} />

    </div>
  )
}
