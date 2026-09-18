import {
  Bell,
  CheckCheck,
  Gift,
  HeartHandshake,
  PiggyBank,
  Settings,
} from 'lucide-react'
import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import { useNotificationsStore } from '@/stores/notifications.store'
import { formatDateTime } from '@/utils/date'
import type { NotificationCategory } from '@/types/coop'
import { cn } from '@/utils/cn'

const CATEGORY_ICON: Record<NotificationCategory, LucideIcon> = {
  Financial: Gift,
  Loan: PiggyBank,
  Savings: PiggyBank,
  Community: HeartHandshake,
  System: Settings,
}

export function NotificationsPage() {
  const items = useNotificationsStore((state) => state.items)
  const markRead = useNotificationsStore((state) => state.markRead)
  const markAllRead = useNotificationsStore((state) => state.markAllRead)
  const [filter, setFilter] = useState('All')

  const categories = [
    'All',
    'Financial',
    'Loan',
    'Savings',
    'Community',
    'System',
  ]
  const filtered =
    filter === 'All' ? items : items.filter((item) => item.category === filter)
  const unreadCount = items.filter((item) => !item.read).length

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `You have ${unreadCount} unread notifications.`
            : 'You are all caught up.'
        }
        breadcrumbs={[{ label: 'Notifications' }]}
        actions={
          unreadCount > 0 ? (
            <Button variant="secondary" onClick={markAllRead}>
              <CheckCheck className="size-4" aria-hidden="true" /> Mark all as
              read
            </Button>
          ) : undefined
        }
      />

      <Tabs
        items={categories.map((category) => ({
          value: category,
          label: category,
        }))}
        value={filter}
        onChange={setFilter}
      />

      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You're all caught up in this category."
          />
        ) : (
          <div className="border-border bg-surface shadow-card overflow-hidden rounded-2xl border">
            <div className="divide-border divide-y">
              {filtered.map((item) => {
                const Icon = CATEGORY_ICON[item.category]
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => markRead(item.id)}
                    className={cn(
                      'hover:bg-surface-hover flex w-full items-start gap-3 px-5 py-4 text-left transition-colors',
                      !item.read && 'bg-brand-soft/40',
                    )}
                  >
                    <span className="bg-brand-soft text-brand-strong flex size-9 shrink-0 items-center justify-center rounded-full">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-text truncate text-sm font-semibold">
                          {item.title}
                        </p>
                        {!item.read && (
                          <span className="bg-brand size-1.5 shrink-0 rounded-full" />
                        )}
                      </div>
                      <p className="text-text-muted mt-0.5 text-sm">
                        {item.message}
                      </p>
                      <p className="text-text-muted mt-1 text-xs">
                        {formatDateTime(item.date)} · {item.category}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
