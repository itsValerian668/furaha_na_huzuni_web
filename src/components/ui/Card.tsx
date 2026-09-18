import type { HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'border-border bg-surface shadow-card rounded-2xl border',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 px-5 pt-5',
        className,
      )}
    >
      <div>
        <h3 className="text-text text-sm font-semibold">{title}</h3>
        {description && (
          <p className="text-text-muted mt-0.5 text-xs">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
