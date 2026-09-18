import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Role } from '@/types/coop'

interface RoleState {
  /**
   * Demo/Preview Role override — lets any signed-in demo user preview the
   * app as any role without a real permissions backend. See docs/AUTH.md.
   * `null` means "use the signed-in user's own role".
   */
  previewRole: Role | null
  setPreviewRole: (role: Role | null) => void
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      previewRole: null,
      setPreviewRole: (role) => set({ previewRole: role }),
    }),
    { name: 'demo-preview-role' },
  ),
)
