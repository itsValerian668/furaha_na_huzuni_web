import { create } from 'zustand'

import { notifications as seedNotifications } from '@/data/notifications'
import type { AppNotification } from '@/types/coop'

interface NotificationsState {
  items: AppNotification[]
  markRead: (id: string) => void
  markAllRead: () => void
}

/** Mutable, in-memory mirror of the mock notification feed so "mark as read" has somewhere to write. */
export const useNotificationsStore = create<NotificationsState>((set) => ({
  items: seedNotifications,
  markRead: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      items: state.items.map((item) => ({ ...item, read: true })),
    })),
}))
