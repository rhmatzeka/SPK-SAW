import { persist } from 'zustand/middleware'
import { create } from 'zustand'

type ThemeMode = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      setMode: (mode) => {
        document.documentElement.classList.toggle('dark', mode === 'dark')
        set({ mode })
      },
      toggleMode: () => {
        const nextMode = get().mode === 'light' ? 'dark' : 'light'
        document.documentElement.classList.toggle('dark', nextMode === 'dark')
        set({ mode: nextMode })
      },
    }),
    {
      name: 'spk-saw-theme',
      onRehydrateStorage: () => (state) => {
        const mode = state?.mode ?? 'light'
        document.documentElement.classList.toggle('dark', mode === 'dark')
      },
    },
  ),
)
