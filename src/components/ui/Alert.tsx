import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

const VARIANT_CONFIG = {
  info: {
    icon: Info,
    classes: 'bg-brand-soft text-brand-strong border-brand/20',
  },
  success: {
    icon: CheckCircle2,
    classes: 'bg-positive-soft text-positive border-positive/20',
  },
  error: {
    icon: AlertTriangle,
    classes: 'bg-negative-soft text-negative border-negative/20',
  },
} as const

export function Alert({
  variant = 'info',
  children,
  className,
}: {
  variant?: keyof typeof VARIANT_CONFIG
  children: ReactNode
  className?: string
}) {
  const { icon: Icon, classes } = VARIANT_CONFIG[variant]

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 rounded-lg border p-3 text-sm',
        classes,
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}
