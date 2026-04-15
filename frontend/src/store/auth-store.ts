import { persist } from 'zustand/middleware'
import { create } from 'zustand'

import type { User } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  hydrated: boolean
  setSession: (payload: { token: string; user: User }) => void
  setUser: (user: User | null) => void
  clearSession: () => void
  setHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      setSession: ({ token, user }) => set({ token, user }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ token: null, user: null }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: 'spk-saw-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)
