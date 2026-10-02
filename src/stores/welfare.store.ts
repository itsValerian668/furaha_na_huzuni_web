import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { welfareRequests as initialRequests } from '@/data/welfare'
import type { WelfareRequest } from '@/types/coop'

interface WelfareState {
  requests: WelfareRequest[]

  addRequest: (request: WelfareRequest) => void
  updateRequest: (
    id: string,
    updates: Partial<WelfareRequest>,
  ) => void
}

export const useWelfareStore = create<WelfareState>()(
  persist(
    (set) => ({
      requests: initialRequests,

      addRequest: (request) =>
        set((state) => ({
          requests: [...state.requests, request],
        })),

      updateRequest: (id, updates) =>
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id
              ? {
                  ...request,
                  ...updates,
                }
              : request,
          ),
        })),
    }),
    {
      name: 'coop-welfare',
    },
  ),
)