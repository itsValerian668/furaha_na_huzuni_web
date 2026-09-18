import type { LucideIcon } from 'lucide-react'

import {
  formatCurrency,
  formatCurrencyCompact,
  formatNumber,
  formatPercent,
} from '@/utils/currency'
import { cn } from '@/utils/cn'

export function StatCard({
  label,
  amount,
  format = 'currency',
  compact = false,
  change,
  icon: Icon,
  tone = 'brand',
  helperText,
}: {
  label: string
  amount: number
  /** 'currency' formats as TSh; 'count' as a plain number (members, shares, requests); 'percent' as a rate. */
  format?: 'currency' | 'count' | 'percent'
  compact?: boolean
  change?: number
  icon?: LucideIcon
  tone?: 'brand' | 'gold' | 'neutral'
  helperText?: string
}) {
  const toneClasses = {
    brand: 'bg-brand-soft text-brand-strong',
    gold: 'bg-accent-soft text-accent',
    neutral: 'bg-surface-sunken text-text-muted',
  }[tone]

  const displayValue =
    format === 'count'
      ? formatNumber(amount)
      : format === 'percent'
        ? formatPercent(amount)
        : compact
          ? formatCurrencyCompact(amount)
          : formatCurrency(amount)

  return (
    <div className="border-border bg-surface shadow-card rounded-2xl border p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-text-muted text-sm font-medium">{label}</p>
        {Icon && (
          <span
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-xl',
              toneClasses,
            )}
          >
            <Icon className="size-4.5" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="text-text mt-3 text-2xl font-bold tracking-tight tabular-nums">
        {displayValue}
      </p>
      {(change !== undefined || helperText) && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          {change !== undefined && (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-1.5 py-0.5 font-semibold',
                change >= 0
                  ? 'bg-positive-soft text-positive'
                  : 'bg-negative-soft text-negative',
              )}
            >
              {formatPercent(change, { signed: true })}
            </span>
          )}
          {helperText && <span className="text-text-muted">{helperText}</span>}
        </div>
      )}
    </div>
  )
}
