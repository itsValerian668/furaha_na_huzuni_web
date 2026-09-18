import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Dropdown } from '@/components/ui/Dropdown'
import { useNotificationsStore } from '@/stores/notifications.store'
import { formatRelative } from '@/utils/date'
import { cn } from '@/utils/cn'

export function NotificationBell() {
  const items = useNotificationsStore((state) => state.items)
  const markRead = useNotificationsStore((state) => state.markRead)
  const unreadCount = items.filter((item) => !item.read).length
  const preview = items.slice(0, 5)

  return (
    <Dropdown
      align="end"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ''}`}
          className="text-text-muted hover:bg-surface-hover hover:text-text relative flex size-9 items-center justify-center rounded-full transition-colors"
        >
          <Bell className="size-4.5" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="bg-negative ring-surface absolute top-1.5 right-1.5 flex size-2 rounded-full ring-2" />
          )}
        </button>
      )}
    >
      {(close) => (
        <div className="w-80">
          <div className="flex items-center justify-between px-3 pt-1 pb-2">
            <p className="text-text text-sm font-semibold">Notifications</p>
            {unreadCount > 0 && (
              <span className="bg-brand-soft text-brand-strong rounded-full px-2 py-0.5 text-xs font-semibold">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            {preview.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => markRead(item.id)}
                className="hover:bg-surface-hover flex flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left transition-colors"
              >
                <span className="flex w-full items-center gap-2">
                  <span
                    className={cn(
                      'size-1.5 shrink-0 rounded-full',
                      item.read ? 'bg-transparent' : 'bg-brand',
                    )}
                  />
                  <span className="text-text flex-1 truncate text-sm font-medium">
                    {item.title}
                  </span>
                </span>
                <span className="text-text-muted pl-3.5 text-xs">
                  {formatRelative(item.date)}
                </span>
              </button>
            ))}
          </div>
          <Link
            to="/notifications"
            onClick={close}
            className="text-brand-strong hover:bg-surface-hover mt-1 block rounded-lg px-3 py-2 text-center text-sm font-medium"
          >
            View all notifications
          </Link>
        </div>
      )}
    </Dropdown>
  )
}
