import {
  ArrowLeftRight,
  Gift,
  HandCoins,
  HeartHandshake,
  PieChart,
  PiggyBank,
  Receipt,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { AmountDisplay } from '@/components/ui/AmountDisplay'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { Transaction } from '@/types/coop'
import { formatDate } from '@/utils/date'

const TYPE_ICON: Record<Transaction['type'], LucideIcon> = {
  SAVINGS: PiggyBank,
  SHARE: PieChart,
  LOAN_DISBURSEMENT: HandCoins,
  LOAN_REPAYMENT: HandCoins,
  DIVIDEND: Gift,
  WELFARE: HeartHandshake,
  FEE: Receipt,
  ADJUSTMENT: ArrowLeftRight,
}

export function TransactionRow({
  transaction,
  showMember = false,
}: {
  transaction: Transaction
  showMember?: boolean
}) {
  const Icon = TYPE_ICON[transaction.type]

  return (
    <div className="flex items-center gap-3 py-3">
      <span className="bg-brand-soft text-brand-strong flex size-9 shrink-0 items-center justify-center rounded-full">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-text truncate text-sm font-medium">
          {transaction.description}
        </p>
        <p className="text-text-muted truncate text-xs">
          {formatDate(transaction.date)}
          {showMember
            ? ` · ${transaction.memberName}`
            : ` · ${transaction.reference}`}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <AmountDisplay amount={transaction.amount} showSign size="sm" />
        <StatusBadge status={transaction.status} />
      </div>
    </div>
  )
}
