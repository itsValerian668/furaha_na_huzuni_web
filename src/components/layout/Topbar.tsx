import { Menu, Search } from 'lucide-react'
import { useState } from 'react'

import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal'
import { NotificationBell } from '@/components/layout/NotificationBell'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { UserMenu } from '@/components/layout/UserMenu'
import { useUiStore } from '@/stores/ui.store'

export function Topbar() {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="border-border bg-surface/95 sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-sm sm:px-6">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Open navigation menu"
          className="text-text-muted hover:bg-surface-hover flex size-9 items-center justify-center rounded-lg md:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="border-border bg-surface-sunken text-text-muted hover:border-border-strong flex min-w-0 flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors sm:max-w-sm"
        >
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden truncate sm:inline-block">
            Search members, loans, transactions…
          </span>
          <span className="truncate sm:hidden">Search…</span>
          <kbd className="border-border bg-surface text-text-muted ml-auto hidden shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] sm:inline">
            ⌘K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <NotificationBell />
          <div className="bg-border mx-1 hidden h-6 w-px sm:block" />
          <UserMenu />
        </div>
      </header>

      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  )
}
