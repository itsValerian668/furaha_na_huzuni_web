import { cn } from '@/utils/cn'

export type BadgeTone = 'positive' | 'warning' | 'negative' | 'neutral' | 'info'

const TONE_CLASSES: Record<BadgeTone, string> = {
  positive: 'bg-positive-soft text-positive',
  warning: 'bg-warning-soft text-warning',
  negative: 'bg-negative-soft text-negative',
  neutral: 'bg-surface-sunken text-text-muted',
  info: 'bg-brand-soft text-brand-strong',
}

/** Status strings across the app mapped to a semantic tone — extend as new statuses appear. */
const STATUS_TONE: Record<string, BadgeTone> = {
  ACTIVE: 'positive',
  COMPLETED: 'positive',
  CONFIRMED: 'positive',
  APPROVED: 'positive',
  PAID: 'positive',
  DISBURSED: 'positive',
  SUCCESS: 'positive',
  IN_GOOD_STANDING: 'positive',
  CALCULATED: 'positive',
  OPEN: 'positive',

  PENDING: 'warning',
  UNDER_REVIEW: 'warning',
  DUE: 'warning',
  UPCOMING: 'neutral',
  ARREARS: 'warning',

  SUSPENDED: 'negative',
  INACTIVE: 'neutral',
  REJECTED: 'negative',
  FAILED: 'negative',
  OVERDUE: 'negative',
  REVERSED: 'negative',
  CLOSED: 'neutral',
}

const STATUS_LABEL: Record<string, string> = {
  IN_GOOD_STANDING: 'In Good Standing',
  UNDER_REVIEW: 'Under Review',
  LOAN_DISBURSEMENT: 'Loan Disbursement',
  LOAN_REPAYMENT: 'Loan Repayment',
}

function humanize(value: string): string {
  if (STATUS_LABEL[value]) return STATUS_LABEL[value]
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function StatusBadge({
  status,
  tone,
  className,
}: {
  status: string
  tone?: BadgeTone
  className?: string
}) {
  const resolvedTone = tone ?? STATUS_TONE[status] ?? 'neutral'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        TONE_CLASSES[resolvedTone],
        className,
      )}
    >
      <span
        className="size-1.5 rounded-full bg-current opacity-70"
        aria-hidden="true"
      />
      {humanize(status)}
    </span>
  )
}
