import { BarChart3, Gift, HandCoins, PiggyBank, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'

const REPORTS = [
  {
    to: '/admin/reports/financial',
    icon: BarChart3,
    title: 'Financial Report',
    description: 'Income, expenses and profit performance.',
  },
  {
    to: '/admin/reports/savings',
    icon: PiggyBank,
    title: 'Savings Report',
    description: 'Contribution trends and active savers.',
  },
  {
    to: '/admin/reports/loans',
    icon: HandCoins,
    title: 'Loan Report',
    description: 'Portfolio, repayment and overdue analysis.',
  },
  {
    to: '/admin/reports/members',
    icon: Users,
    title: 'Member Report',
    description: 'Growth, status and branch distribution.',
  },
  {
    to: '/admin/reports/dividends',
    icon: Gift,
    title: 'Dividend Report',
    description: 'Distribution history and projections.',
  },
]

export function AdminReportsIndexPage() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Cooperative-wide reporting across every module."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Reports' },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((report) => (
          <button
            key={report.to}
            type="button"
            onClick={() => navigate(report.to)}
            className="text-left"
          >
            <Card className="hover:bg-surface-hover p-5 transition-colors">
              <span className="bg-brand-soft text-brand-strong flex size-10 items-center justify-center rounded-xl">
                <report.icon className="size-5" aria-hidden="true" />
              </span>
              <p className="text-text mt-3 text-sm font-semibold">
                {report.title}
              </p>
              <p className="text-text-muted mt-1 text-xs">
                {report.description}
              </p>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
