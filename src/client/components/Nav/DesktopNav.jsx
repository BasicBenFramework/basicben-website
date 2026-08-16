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

      {/* Log in / Sign up are hidden for now, together with the /login and
          /register routes in src/routes/App.jsx — restore the two together.
          The divider is inside the branch so a signed-out visitor does not get
          two of them with nothing in between. */}
      {user && (
        <>
          <div className={`w-px h-5 mx-1 ${dark ? 'bg-white/20' : 'bg-black/20'}`} />
          <NavLink onClick={() => navigate('/posts')}>My Posts</NavLink>
          <NavLink onClick={() => navigate('/profile')}>Profile</NavLink>
          <NavLink onClick={handleLogout}>Log out</NavLink>
        </>
      )}

      <div className={`w-px h-5 mx-1 ${dark ? 'bg-white/20' : 'bg-black/20'}`} />

      <DarkModeToggle dark={dark} setDark={setDark} />

    </div>
  )
}
