import { NavLink } from 'react-router-dom'

import { cn } from '@/utils/cn'

export function SectionTabs({
  items,
}: {
  items: Array<{ label: string; to: string; end?: boolean }>
}) {
  return (
    <div className="bg-surface-sunken no-scrollbar mb-6 flex gap-1 overflow-x-auto rounded-lg p-1">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'shrink-0 rounded-md px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'bg-surface text-brand-strong shadow-card'
                : 'text-text-muted hover:text-text',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}
