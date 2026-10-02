import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { meetings as initialMeetings } from '@/data/governance'
import type { Meeting } from '@/types/coop'

interface MeetingsState {
  meetings: Meeting[]

  addMeeting: (meeting: Meeting) => void
  updateMeeting: (id: string, updates: Partial<Meeting>) => void
  deleteMeeting: (id: string) => void

  toggleGlobalPin: (id: string) => void
  togglePersonalPin: (id: string, memberId: number) => void
}

export const useMeetingsStore = create<MeetingsState>()(
  persist(
    (set) => ({
      meetings: initialMeetings,

      addMeeting: (meeting) =>
        set((state) => ({
          meetings: [...state.meetings, meeting],
        })),

      updateMeeting: (id, updates) =>
        set((state) => ({
          meetings: state.meetings.map((meeting) =>
            meeting.id === id
              ? { ...meeting, ...updates }
              : meeting,
          ),
        })),

      deleteMeeting: (id) =>
        set((state) => ({
          meetings: state.meetings.filter(
            (meeting) => meeting.id !== id,
          ),
        })),

      toggleGlobalPin: (id) =>
        set((state) => ({
          meetings: state.meetings.map((meeting) =>
            meeting.id === id
              ? {
                  ...meeting,
                  globalPinned: !meeting.globalPinned,
                }
              : meeting,
          ),
        })),

      togglePersonalPin: (id, memberId) =>
        set((state) => ({
          meetings: state.meetings.map((meeting) => {
            if (meeting.id !== id) {
              return meeting
            }

            const pinnedBy = meeting.personalPinnedBy ?? []

            const alreadyPinned = pinnedBy.includes(memberId)

            return {
              ...meeting,
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
      name: 'coop-meetings',
    },
  ),
)