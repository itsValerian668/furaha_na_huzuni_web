import { cn } from '@/utils/cn'

export function ProgressBar({
  value,
  max = 100,
  tone = 'brand',
  className,
  label,
}: {
  value: number
  max?: number
  tone?: 'brand' | 'gold' | 'positive' | 'negative'
  className?: string
  label?: string
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  const toneClasses = {
    brand: 'bg-brand',
    gold: 'bg-accent',
    positive: 'bg-positive',
    negative: 'bg-negative',
  }[tone]

  return (
    <div className={cn('w-full', className)}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="bg-surface-sunken h-2 w-full overflow-hidden rounded-full"
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-500 ease-out',
            toneClasses,
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
