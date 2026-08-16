import { useAuth } from '@basicbenframework/core/client'
import { useTheme } from '../ThemeContext'
import { NavLink } from '../NavLink'
import { DarkModeToggle } from './DarkModeToggle'

export function DesktopNav({ navigate }) {
  const { t, dark, setDark } = useTheme()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="hidden sm:flex items-center gap-2">
      <NavLink onClick={() => navigate('/docs')}>Docs</NavLink>
      <NavLink onClick={() => navigate('/feed')}>Feed</NavLink>

      <div className={`w-px h-5 mx-1 ${dark ? 'bg-white/20' : 'bg-black/20'}`} />

      {user ? (
        <>
          <NavLink onClick={() => navigate('/posts')}>My Posts</NavLink>
          <NavLink onClick={() => navigate('/profile')}>Profile</NavLink>
          <NavLink onClick={handleLogout}>Log out</NavLink>
        </>
      ) : (
        <>
          <NavLink onClick={() => navigate('/login')}>Log in</NavLink>
          <NavLink onClick={() => navigate('/register')}>Sign up</NavLink>
        </>
      )}

      <div className={`w-px h-5 mx-1 ${dark ? 'bg-white/20' : 'bg-black/20'}`} />

      <DarkModeToggle dark={dark} setDark={setDark} />

    </div>
  )
}
