import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  cycleTheme: () => void
}

const CYCLE_ORDER: Theme[] = ['light', 'dark', 'system']

const resolveIsDark = (theme: Theme): boolean => {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
}

const applyThemeToDOM = (theme: Theme) => {
  if (typeof document === 'undefined') return
  const isDark = resolveIsDark(theme)
  document.documentElement.classList.toggle('dark', isDark)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',

      setTheme: (theme) => {
        set({ theme })
        applyThemeToDOM(theme)
      },

      cycleTheme: () => {
        const currentIndex = CYCLE_ORDER.indexOf(get().theme)
        const nextTheme = CYCLE_ORDER[(currentIndex + 1) % CYCLE_ORDER.length]
        get().setTheme(nextTheme)
      },
    }),
    {
      name: 'theme',
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeToDOM(state.theme)
      },
    },
  ),
)

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const { theme } = useThemeStore.getState()
    if (theme === 'system') applyThemeToDOM('system')
  })
}
