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

const THEME = {
  bg: 'bg-black light:bg-white',
  text: 'text-white light:text-black',
  muted: 'text-white/50 light:text-black/50',
  subtle: 'text-white/30 light:text-black/30',
  border: 'border-white/10 light:border-black/10',
  card: 'bg-white/5 light:bg-black/5',
  btn: 'bg-white text-black light:bg-black light:text-white',
  btnHover: 'hover:bg-white/90 light:hover:bg-black/90',
  btnSecondary: 'bg-white/10 hover:bg-white/20 light:bg-black/10 light:hover:bg-black/20'
}

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
    document.documentElement.classList.toggle('light', !dark)
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  }, [dark])

  // One set of classes for both themes: the light ones apply under
  // <html class="light">, which index.html sets before the first paint. The
  // prerendered page is then right for every visitor, with no dark flash.
  const t = THEME

  return (
    <ThemeContext.Provider value={{ t, dark, setDark }}>
      <ToastProvider>
        <div className={`min-h-screen ${t.bg} ${t.text} transition-colors duration-300`}>
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] bg-purple-500/10 light:bg-purple-500/5`} />
            <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[150px] bg-blue-500/10 light:bg-blue-500/5`} />
          </div>
          <div className="relative">{children}</div>
        </div>
      </ToastProvider>
    </ThemeContext.Provider>
  )
}
