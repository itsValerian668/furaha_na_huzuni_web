import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

/** Sets data-theme on <html> (:root) — that's what index.css's [data-theme] selectors target. */
function applyThemeToDocument(theme: Theme) {
  if (typeof document === 'undefined') return
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => {
        applyThemeToDocument(theme)
        set({ theme })
      },
    }),
    {
      name: 'theme',
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeToDocument(state.theme)
      },
    },
  ),
)
