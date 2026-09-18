import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

import { MobileSidebarContent } from '@/components/layout/Sidebar'
import { useUiStore } from '@/stores/ui.store'

export function MobileNav() {
  const isOpen = useUiStore((state) => state.isSidebarOpen)
  const closeSidebar = useUiStore((state) => state.closeSidebar)

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-40 md:hidden">
      <div
        className="animate-fade-in bg-forest-deep/50 absolute inset-0"
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <div className="animate-slide-in-right border-border bg-surface shadow-elevated absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r">
        <button
          type="button"
          onClick={closeSidebar}
          aria-label="Close navigation menu"
          className="text-text-muted hover:bg-surface-hover absolute top-4 right-3 flex size-8 items-center justify-center rounded-lg"
        >
          <X className="size-4.5" aria-hidden="true" />
        </button>
        <MobileSidebarContent onNavigate={closeSidebar} />
      </div>
    </div>,
    document.body,
  )
}
