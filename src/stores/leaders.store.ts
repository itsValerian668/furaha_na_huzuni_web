import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Leader } from '@/types/coop'
import { leaders as initialLeaders } from '@/data/governance'

export interface ManagedLeader extends Leader {
  active: boolean
}

interface LeadersState {
  leaders: ManagedLeader[]
  addLeader: (leader: ManagedLeader) => void
  updateLeader: (id: string, updates: Partial<ManagedLeader>) => void
  toggleLeaderStatus: (id: string) => void
}

const startingLeaders: ManagedLeader[] = initialLeaders.map((leader) => ({
  ...leader,
  active: true,
}))

export const useLeadersStore = create<LeadersState>()(
  persist(
    (set) => ({
      leaders: startingLeaders,

      addLeader: (leader) =>
        set((state) => ({
          leaders: [...state.leaders, leader],
        })),

      updateLeader: (id, updates) =>
        set((state) => ({
          leaders: state.leaders.map((leader) =>
            leader.id === id
              ? { ...leader, ...updates }
              : leader,
          ),
        })),

      toggleLeaderStatus: (id) =>
        set((state) => ({
          leaders: state.leaders.map((leader) =>
            leader.id === id
              ? { ...leader, active: !leader.active }
              : leader,
          ),
        })),
    }),
    {
      name: 'coop-leaders',
    },
  ),
)
