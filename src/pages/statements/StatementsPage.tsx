import { FileText, HandCoins, PieChart, PiggyBank } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'
import { currentMember } from '@/data/members'
import { formatDate } from '@/utils/date'

const STATEMENTS = [
  {
    to: '/statements/savings',
    icon: PiggyBank,
    title: 'Savings Statement',
    description: 'Full history of your savings contributions.',
  },
  {
    to: '/statements/loans',
    icon: HandCoins,
    title: 'Loan Statement',
    description: 'Disbursements, repayments and balances.',
  },
  {
    to: '/statements/shares',
    icon: PieChart,
    title: 'Share Statement',
    description: 'Share purchases and current value.',
  },
]

export function StatementsPage() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Statements"
        description="Official records of your cooperative account."
        breadcrumbs={[{ label: 'Statements' }]}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {STATEMENTS.map((statement) => (
          <button
            key={statement.to}
            type="button"
            onClick={() => navigate(statement.to)}
            className="text-left"
          >
            <Card className="hover:bg-surface-hover p-5 transition-colors">
              <span className="bg-brand-soft text-brand-strong flex size-10 items-center justify-center rounded-xl">
                <statement.icon className="size-5" aria-hidden="true" />
              </span>
              <p className="text-text mt-3 text-sm font-semibold">
                {statement.title}
              </p>
              <p className="text-text-muted mt-1 text-xs">
                {statement.description}
              </p>
            </Card>
          </button>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <div className="flex items-center gap-3">
          <span className="bg-surface-sunken text-text-muted flex size-10 items-center justify-center rounded-xl">
            <FileText className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-text text-sm font-semibold">Member since</p>
            <p className="text-text-muted text-xs">
              {currentMember.memberNumber} ·{' '}
              {formatDate(currentMember.joinedOn)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
