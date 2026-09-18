import { formatCurrency } from '@/utils/currency'
import { cn } from '@/utils/cn'

export function AmountDisplay({
  amount,
  size = 'md',
  showSign = false,
  className,
}: {
  amount: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSign?: boolean
  className?: string
}) {
  const isNegative = amount < 0
  const isPositive = amount > 0

  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-semibold',
    lg: 'text-2xl font-bold tracking-tight',
    xl: 'text-4xl font-bold tracking-tight',
  }[size]

  return (
    <span
      className={cn(
        'font-sans tabular-nums',
        sizeClasses,
        showSign && isNegative && 'text-negative',
        showSign && isPositive && 'text-positive',
        !showSign && 'text-text',
        className,
      )}
    >
      {showSign && isPositive ? '+' : ''}
      {formatCurrency(amount)}
    </span>
  )
}
