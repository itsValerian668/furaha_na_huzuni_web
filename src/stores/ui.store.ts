import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  /** Mobile slide-out sidebar — open/closed. */
  isSidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  /** Desktop collapsible sidebar — collapsed to icon rail. Persisted across sessions. */
  isSidebarCollapsed: boolean
  toggleSidebarCollapsed: () => void
}

/** Ephemeral + lightly persisted UI chrome state — not server data. */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isSidebarOpen: false,
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      closeSidebar: () => set({ isSidebarOpen: false }),
      isSidebarCollapsed: false,
      toggleSidebarCollapsed: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    }),
    {
      name: 'ui-chrome',
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    },
  ),
)
