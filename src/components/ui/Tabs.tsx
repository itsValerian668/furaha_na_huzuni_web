import { cn } from '@/utils/cn'

export interface TabItem {
  value: string
  label: string
  count?: number
}

export function Tabs({
  items,
  value,
  onChange,
}: {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div
      role="tablist"
      className="bg-surface-sunken no-scrollbar flex gap-1 overflow-x-auto rounded-lg p-1"
    >
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors',
              active
                ? 'bg-surface text-brand-strong shadow-card'
                : 'text-text-muted hover:text-text',
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs',
                  active
                    ? 'bg-brand-soft text-brand-strong'
                    : 'bg-surface text-text-muted',
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
