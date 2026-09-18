import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

import { useToastStore, type ToastVariant } from '@/stores/toast.store'
import { cn } from '@/utils/cn'

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: typeof Info; classes: string }
> = {
  success: {
    icon: CheckCircle2,
    classes: 'border-positive/30 bg-positive-soft text-positive',
  },
  error: {
    icon: AlertTriangle,
    classes: 'border-negative/30 bg-negative-soft text-negative',
  },
  info: {
    icon: Info,
    classes: 'border-brand/30 bg-brand-soft text-brand-strong',
  },
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((item) => {
        const { icon: Icon, classes } = VARIANT_CONFIG[item.variant]
        return (
          <div
            key={item.id}
            role="status"
            className={cn(
              'animate-slide-up shadow-elevated pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 backdrop-blur-sm',
              'bg-surface',
              classes,
            )}
          >
            <Icon className="mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
            <p className="flex-1 text-sm font-medium">{item.message}</p>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
              className="rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
