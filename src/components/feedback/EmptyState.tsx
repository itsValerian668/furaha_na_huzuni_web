import { Inbox } from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
}: {
  title: string
  description?: string
  action?: ReactNode
  icon?: ComponentType<{ className?: string }>
}) {
  return (
    <div className="border-border flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
      <span className="bg-surface-sunken flex size-12 items-center justify-center rounded-full">
        <Icon className="text-text-muted size-5" />
      </span>
      <div>
        <p className="text-text text-sm font-medium">{title}</p>
        {description && (
          <p className="text-text-muted mt-1 max-w-sm text-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
