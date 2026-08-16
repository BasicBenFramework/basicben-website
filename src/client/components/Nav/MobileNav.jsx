import { useAuth } from '@basicbenframework/core/client'
import { useTheme } from '../ThemeContext'
import { Logo } from '../Logo'

export function MobileNav({ navigate, onClose }) {
  const { t } = useTheme()
  const { user, logout } = useAuth()

  const handleNav = (view) => {
    navigate(view)
    onClose()
  }

  const handleLogout = () => {
    logout()
    handleNav('/')
  }

  return (
    <div className={`fixed inset-0 z-50 ${t.bg} ${t.text}`}>
      <div className="flex flex-col h-full">
        <div className={`flex items-center justify-between h-14 px-6 border-b ${t.border}`}>
          <span className="flex items-center gap-2 font-semibold">
            <Logo className="w-5 h-5" />
            <span>BasicBen</span>
          </span>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${t.card} transition`}
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-1">
            <button
              onClick={() => handleNav('/')}
              className={`w-full text-left px-4 py-3 rounded-lg ${t.card} hover:opacity-80 transition`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/docs')}
              className={`w-full text-left px-4 py-3 rounded-lg ${t.card} hover:opacity-80 transition`}
            >
              Docs
            </button>
            <button
              onClick={() => handleNav('/feed')}
              className={`w-full text-left px-4 py-3 rounded-lg ${t.card} hover:opacity-80 transition`}
            >
              Feed
            </button>

            {user ? (
              <>
                <button
                  onClick={() => handleNav('/posts')}
                  className={`w-full text-left px-4 py-3 rounded-lg ${t.card} hover:opacity-80 transition`}
                >
                  My Posts
                </button>
                <button
                  onClick={() => handleNav('/profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg ${t.card} hover:opacity-80 transition`}
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className={`w-full text-left px-4 py-3 rounded-lg ${t.card} hover:opacity-80 transition`}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNav('/login')}
                  className={`w-full text-left px-4 py-3 rounded-lg ${t.card} hover:opacity-80 transition`}
                >
                  Log in
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className={`w-full text-left px-4 py-3 rounded-lg ${t.card} hover:opacity-80 transition`}
                >
                  Sign up
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
