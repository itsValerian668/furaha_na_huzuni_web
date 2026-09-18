import { Plus } from 'lucide-react'
import { useState } from 'react'

import { AddSavingsModal } from '@/components/financial/AddSavingsModal'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { savingsContributions, savingsOverview } from '@/data/savings'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function SavingsContributionsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const upcoming = {
    dueDate: '2026-09-12',
    amount: savingsOverview.weeklyTarget,
  }

  return (
    <div>
      <PageHeader
        title="Contributions"
        description="Your weekly contribution schedule."
        breadcrumbs={[
          { label: 'Savings', to: '/savings' },
          { label: 'Contributions' },
        ]}
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="size-4" aria-hidden="true" /> Add Contribution
          </Button>
        }
      />
      <SectionTabs
        items={[
          { label: 'Overview', to: '/savings', end: true },
          { label: 'History', to: '/savings/history' },
          { label: 'Goals', to: '/savings/goals' },
          { label: 'Contributions', to: '/savings/contributions' },
        ]}
      />

      <Card className="mb-6 flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-text text-sm font-semibold">
            Next contribution due
          </p>
          <p className="text-text-muted text-xs">
            {formatDate(upcoming.dueDate)} · {savingsOverview.currentCycle}
          </p>
        </div>
        <p className="text-text text-2xl font-bold">
          {formatCurrency(upcoming.amount)}
        </p>
      </Card>

      <div className="border-border bg-surface shadow-card overflow-hidden rounded-2xl border">
        <div className="divide-border divide-y">
          {savingsContributions.map((contribution) => (
            <div
              key={contribution.id}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div>
                <p className="text-text text-sm font-medium">
                  {formatDate(contribution.date)}
                </p>
                <p className="text-text-muted text-xs">{contribution.cycle}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={contribution.status} />
                <span className="text-text w-28 text-right text-sm font-semibold">
                  {formatCurrency(contribution.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddSavingsModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
