import { Download } from 'lucide-react'
import { useMemo, useState } from 'react'

import { DataTable } from '@/components/tables/DataTable'
import { AmountDisplay } from '@/components/ui/AmountDisplay'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { getMemberTransactions } from '@/data/transactions'
import { currentMember } from '@/data/members'
import { toast } from '@/stores/toast.store'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import type { TransactionType } from '@/types/coop'

const TYPE_OPTIONS: Array<{ value: TransactionType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All types' },
  { value: 'SAVINGS', label: 'Savings' },
  { value: 'SHARE', label: 'Share' },
  { value: 'LOAN_DISBURSEMENT', label: 'Loan Disbursement' },
  { value: 'LOAN_REPAYMENT', label: 'Loan Repayment' },
  { value: 'DIVIDEND', label: 'Dividend' },
  { value: 'WELFARE', label: 'Welfare' },
  { value: 'FEE', label: 'Fee' },
  { value: 'ADJUSTMENT', label: 'Adjustment' },
]

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'REVERSED', label: 'Reversed' },
]

export function TransactionsPage() {
  const [type, setType] = useState<string>('ALL')
  const [status, setStatus] = useState<string>('ALL')
  const allTransactions = getMemberTransactions(currentMember.id)

  const filtered = useMemo(
    () =>
      allTransactions.filter(
        (transaction) =>
          (type === 'ALL' || transaction.type === type) &&
          (status === 'ALL' || transaction.status === status),
      ),
    [allTransactions, type, status],
  )

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="A complete, transparent ledger of your cooperative activity."
        breadcrumbs={[{ label: 'Transactions' }]}
        actions={
          <Button
            variant="secondary"
            onClick={() => toast('Transaction ledger exported.')}
          >
            <Download className="size-4" aria-hidden="true" /> Export
          </Button>
        }
      />

      <DataTable
        data={filtered}
        keyField={(row) => row.id}
        searchFields={(row) => [row.reference, row.description]}
        searchPlaceholder="Search by reference or description…"
        filters={
          <div className="flex gap-2">
            <Select
              value={type}
              onChange={(event) => setType(event.target.value)}
              options={TYPE_OPTIONS}
            />
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              options={STATUS_OPTIONS}
            />
          </div>
        }
        columns={[
          {
            key: 'date',
            header: 'Date',
            render: (row) => formatDate(row.date),
          },
          {
            key: 'reference',
            header: 'Reference',
            render: (row) => (
              <span className="font-mono text-xs">{row.reference}</span>
            ),
          },
          {
            key: 'description',
            header: 'Description',
            render: (row) => row.description,
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: 'balance',
            header: 'Balance',
            align: 'right',
            render: (row) => formatCurrency(row.balanceAfter),
          },
          {
            key: 'amount',
            header: 'Amount',
            align: 'right',
            render: (row) => (
              <AmountDisplay amount={row.amount} showSign size="sm" />
            ),
          },
        ]}
      />
    </div>
  )
}
