import { useState, useEffect } from 'react'
import { ThemeContext } from '../components/ThemeContext'
import { ToastProvider } from '../contexts/ToastContext'

const STORAGE_KEY = 'theme'

/** The saved choice; dark when there is none. */
function storedDark() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === null ? true : stored === 'dark'
  } catch {
    return true
  }
}

// The first mount hydrates the prerendered page, which is dark, so it must
// start dark too and switch after; a mismatch would leave the prerender's
// classes in place. Later mounts read the saved choice straight away.
let restored = false

export function RootLayout({ children }) {
  // Persisted because RootLayout is mounted inside each layout family, so the
  // router unmounts this subtree when moving between them. An in-memory
  // preference would reset every time you navigated from /docs back to /.
  const [dark, setDark] = useState(() => (restored ? storedDark() : true))

  useEffect(() => {
    if (!restored) {
      restored = true
      const saved = storedDark()
      if (saved !== dark) return setDark(saved)
    }
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  }, [dark])

  const t = dark
    ? { bg: 'bg-black', text: 'text-white', muted: 'text-white/50', subtle: 'text-white/30', border: 'border-white/10', card: 'bg-white/5', btn: 'bg-white text-black', btnHover: 'hover:bg-white/90', btnSecondary: 'bg-white/10 hover:bg-white/20' }
    : { bg: 'bg-white', text: 'text-black', muted: 'text-black/50', subtle: 'text-black/30', border: 'border-black/10', card: 'bg-black/5', btn: 'bg-black text-white', btnHover: 'hover:bg-black/90', btnSecondary: 'bg-black/10 hover:bg-black/20' }

  return (
    <ThemeContext.Provider value={{ t, dark, setDark }}>
      <ToastProvider>
        <div className={`min-h-screen ${t.bg} ${t.text} transition-colors duration-300`}>
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] ${dark ? 'bg-purple-500/10' : 'bg-purple-500/5'}`} />
            <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[150px] ${dark ? 'bg-blue-500/10' : 'bg-blue-500/5'}`} />
          </div>
          <div className="relative">{children}</div>
        </div>
      </ToastProvider>
    </ThemeContext.Provider>
  )
}
