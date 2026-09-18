import { ChevronsLeft, Leaf } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useActiveRole } from '@/hooks/useActiveRole'
import { getVisibleNavGroups } from '@/config/navigation'
import { useUiStore } from '@/stores/ui.store'
import { cn } from '@/utils/cn'

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean
  onNavigate?: () => void
}) {
  const role = useActiveRole()
  const groups = getVisibleNavGroups(role)

  return (
    <nav className="no-scrollbar flex h-full flex-col gap-5 overflow-y-auto px-3 py-5">
      {groups.map((group) => (
        <div key={group.label}>
          {!collapsed && (
            <p className="text-text-muted/80 mb-1.5 px-3 text-[10px] font-bold tracking-widest uppercase">
              {group.label}
            </p>
          )}
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={
                    item.to === '/admin' ||
                    item.to === '/governance' ||
                    item.to === '/dashboard'
                  }
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      collapsed && 'justify-center px-2',
                      isActive
                        ? 'bg-brand-soft text-brand-strong'
                        : 'text-text-muted hover:bg-surface-hover hover:text-text',
                    )
                  }
                >
                  <item.icon className="size-4.5 shrink-0" aria-hidden="true" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function Sidebar() {
  const isCollapsed = useUiStore((state) => state.isSidebarCollapsed)
  const toggleCollapsed = useUiStore((state) => state.toggleSidebarCollapsed)

  return (
    <aside
      className={cn(
        'border-border bg-surface sticky top-0 hidden h-screen shrink-0 border-r transition-[width] duration-200 md:flex md:flex-col',
        isCollapsed ? 'w-[76px]' : 'w-64',
      )}
    >
      <div
        className={cn(
          'border-border flex h-16 items-center gap-2.5 border-b px-4',
          isCollapsed && 'justify-center px-2',
        )}
      >
        <span className="bg-brand text-on-brand flex size-8 shrink-0 items-center justify-center rounded-lg">
          <Leaf className="size-4.5" aria-hidden="true" />
        </span>
        {!isCollapsed && (
          <span className="text-text truncate text-sm font-bold">
            Furaha na Huzuni
          </span>
        )}
      </div>

      <SidebarContent collapsed={isCollapsed} />

      <div className="border-border border-t p-3">
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'text-text-muted hover:bg-surface-hover hover:text-text flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
            isCollapsed && 'justify-center',
          )}
        >
          <ChevronsLeft
            className={cn(
              'size-4 transition-transform',
              isCollapsed && 'rotate-180',
            )}
            aria-hidden="true"
          />
          {!isCollapsed && 'Collapse'}
        </button>
      </div>
    </aside>
  )
}

export function MobileSidebarContent({
  onNavigate,
}: {
  onNavigate: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex h-16 items-center gap-2.5 border-b px-4">
        <span className="bg-brand text-on-brand flex size-8 shrink-0 items-center justify-center rounded-lg">
          <Leaf className="size-4.5" aria-hidden="true" />
        </span>
        <span className="text-text text-sm font-bold">Furaha na Huzuni</span>
      </div>
      <SidebarContent collapsed={false} onNavigate={onNavigate} />
    </div>
  )
}
