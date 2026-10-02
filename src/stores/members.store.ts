import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { members as initialMembers } from '@/data/members'
import type { Member } from '@/types/coop'

interface MembersState {
  members: Member[]
  addMember: (member: Member) => void
  updateMember: (id: string, updates: Partial<Member>) => void
  updateMemberStatus: (id: string, status: Member['status']) => void
}

export const useMembersStore = create<MembersState>()(
  persist(
    (set) => ({
      members: initialMembers,

      addMember: (member) =>
        set((state) => ({
          members: [...state.members, member],
        })),

      updateMember: (id, updates) =>
        set((state) => ({
          members: state.members.map((member) =>
            member.id === id
              ? { ...member, ...updates }
              : member,
          ),
        })),

      updateMemberStatus: (id, status) =>
        set((state) => ({
          members: state.members.map((member) =>
            member.id === id
              ? { ...member, status }
              : member,
          ),
        })),
    }),
    {
      name: 'coop-members',
    },
  ),
)