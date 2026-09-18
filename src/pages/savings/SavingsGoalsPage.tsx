import { Plus, Target } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { savingsGoals } from '@/data/savings'
import { toast } from '@/stores/toast.store'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function SavingsGoalsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('1000000')

  const createGoal = () => {
    setModalOpen(false)
    setName('')
    toast(`Savings goal "${name || 'New goal'}" created.`)
  }

  return (
    <div>
      <PageHeader
        title="Savings Goals"
        description="Set targets and track your progress toward them."
        breadcrumbs={[{ label: 'Savings', to: '/savings' }, { label: 'Goals' }]}
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="size-4" aria-hidden="true" /> Create Goal
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {savingsGoals.map((goal) => {
          const percent = Math.round(
            (goal.savedAmount / goal.targetAmount) * 100,
          )
          return (
            <Card key={goal.id} className="p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="bg-brand-soft text-brand-strong flex size-9 items-center justify-center rounded-xl">
                    <Target className="size-4.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-text text-sm font-semibold">
                      {goal.name}
                    </p>
                    <p className="text-text-muted text-xs">
                      Target date: {formatDate(goal.targetDate)}
                    </p>
                  </div>
                </div>
                <span className="text-text text-lg font-bold">{percent}%</span>
              </div>
              <ProgressBar value={goal.savedAmount} max={goal.targetAmount} />
              <p className="text-text-muted mt-2 text-sm">
                {formatCurrency(goal.savedAmount)} saved of{' '}
                {formatCurrency(goal.targetAmount)}
              </p>
            </Card>
          )
        })}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create a savings goal"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createGoal} disabled={!name.trim()}>
              Create goal
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Goal name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. School Fees Fund"
            required
          />
          <Input
            label="Target amount (TSh)"
            type="number"
            min={10_000}
            step={10_000}
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            required
          />
        </div>
      </Modal>
    </div>
  )
}
