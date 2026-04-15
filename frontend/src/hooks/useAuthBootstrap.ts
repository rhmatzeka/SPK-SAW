import { useEffect } from 'react'

import { authService } from '@/services/auth-service'
import { useAuthStore } from '@/store/auth-store'

export function useAuthBootstrap() {
  const { token, hydrated, setUser, clearSession } = useAuthStore()

  useEffect(() => {
    if (!hydrated || !token) {
      return
    }

    let cancelled = false

    authService
      .me()
      .then((user) => {
        if (!cancelled) {
          setUser(user)
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearSession()
        }
      })

    return () => {
      cancelled = true
    }
  }, [clearSession, hydrated, setUser, token])
}
