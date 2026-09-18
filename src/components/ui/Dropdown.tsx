import { type ReactNode, useEffect, useRef, useState } from 'react'

import { cn } from '@/utils/cn'

export function Dropdown({
  trigger,
  children,
  align = 'end',
}: {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode
  children: (close: () => void) => ReactNode
  align?: 'start' | 'end'
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative inline-block">
      {trigger({ open, toggle: () => setOpen((current) => !current) })}
      {open && (
        <div
          className={cn(
            'animate-slide-up border-border bg-surface shadow-popover absolute z-40 mt-2 min-w-48 rounded-xl border p-1.5',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({
  children,
  onClick,
  icon,
  danger,
}: {
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
        danger
          ? 'text-negative hover:bg-negative-soft'
          : 'text-text hover:bg-surface-hover',
      )}
    >
      {icon}
      {children}
    </button>
  )
}
