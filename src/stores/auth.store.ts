import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { User } from '@/types/auth'

interface AuthState {
  user: User | null
  token: string | null
  setSession: (user: User, token: string) => void
  clearSession: () => void
}

/**
 * Client-side auth state only (current user + token for the Authorization
 * header). Server truth (session validity, permissions) always comes from
 * the API — this store just mirrors it for the UI.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setSession: (user, token) => set({ user, token }),
      clearSession: () => set({ user: null, token: null }),
    }),
    { name: 'auth' },
  ),
)

export const useIsAuthenticated = (): boolean =>
  useAuthStore((state) => state.token !== null)
