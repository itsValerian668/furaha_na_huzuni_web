import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { cooperativeEvents as initialEvents } from '@/data/events'
import type { CooperativeEvent } from '@/types/coop'

interface EventsState {
  events: CooperativeEvent[]

  addEvent: (event: CooperativeEvent) => void
  updateEvent: (
    id: string,
    updates: Partial<CooperativeEvent>,
  ) => void
  deleteEvent: (id: string) => void

  toggleGlobalPin: (id: string) => void
  togglePersonalPin: (id: string, memberId: number) => void
}

export const useEventsStore = create<EventsState>()(
  persist(
    (set) => ({
      events: initialEvents,

      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, event],
        })),

      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id
              ? { ...event, ...updates }
              : event,
          ),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter(
            (event) => event.id !== id,
          ),
        })),

      toggleGlobalPin: (id) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id
              ? {
                  ...event,
                  globalPinned: !event.globalPinned,
                }
              : event,
          ),
        })),

      togglePersonalPin: (id, memberId) =>
        set((state) => ({
          events: state.events.map((event) => {
            if (event.id !== id) {
              return event
            }

            const pinnedBy = event.personalPinnedBy ?? []

            const alreadyPinned = pinnedBy.includes(memberId)

            return {
              ...event,
              personalPinnedBy: alreadyPinned
                ? pinnedBy.filter(
                    (existingId) => existingId !== memberId,
                  )
                : [...pinnedBy, memberId],
            }
          }),
        })),
    }),
    {
      name: 'coop-events',
    },
  ),
)