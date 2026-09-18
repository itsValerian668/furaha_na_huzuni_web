import { HeartHandshake, Users } from 'lucide-react'
import { useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

import { ChartCard } from '@/components/financial/ChartCard'
import { RequestSupportModal } from '@/components/financial/RequestSupportModal'
import { StatCard } from '@/components/financial/StatCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import {
  welfareCategories,
  welfareOverview,
  welfareRequests,
} from '@/data/welfare'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function WelfarePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const myRequests = welfareRequests.filter(
    (request) => request.memberId === 'MB-0001',
  )

  return (
    <div>
      <PageHeader
        title="Welfare & Mutual Support"
        description="Standing together through joy and hardship."
        breadcrumbs={[{ label: 'Welfare & Support' }]}
        actions={
          <Button onClick={() => setModalOpen(true)}>Request Support</Button>
        }
      />
      <SectionTabs
        items={[
          { label: 'Overview', to: '/welfare', end: true },
          { label: 'Requests', to: '/welfare/requests' },
          { label: 'History', to: '/welfare/history' },
        ]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Welfare Fund"
          amount={welfareOverview.fundBalance}
          icon={HeartHandshake}
        />
        <StatCard
          label="Available"
          amount={welfareOverview.available}
          tone="neutral"
        />
        <StatCard
          label="This Year"
          amount={welfareOverview.supportThisYear}
          tone="gold"
        />
        <StatCard
          label="Members Supported"
          amount={welfareOverview.membersSupportedTotal}
          format="count"
          icon={Users}
          tone="neutral"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ChartCard
          title="Disbursements"
          description="Welfare support paid out per month"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={welfareOverview.monthlyDisbursement}
              margin={{ left: 4, right: 12, top: 8 }}
            >
              <defs>
                <linearGradient id="welfareFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#159A78" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#159A78" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: 13,
                }}
              />
              <Area
                dataKey="amount"
                stroke="#159A78"
                strokeWidth={2.5}
                fill="url(#welfareFill)"
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="p-5">
          <p className="text-text mb-3 text-sm font-semibold">
            Support categories
          </p>
          <ul className="flex flex-wrap gap-2">
            {welfareCategories.map((category) => (
              <li
                key={category}
                className="bg-surface-sunken text-text-muted rounded-full px-3 py-1.5 text-xs font-medium"
              >
                {category}
              </li>
            ))}
          </ul>
          <p className="text-text-muted mt-4 text-sm leading-relaxed">
            A portion of every member's contribution funds the Welfare Fund,
            which provides mutual support during medical emergencies,
            bereavement, education needs and other hardships.
          </p>
        </Card>
      </div>

      {myRequests.length > 0 && (
        <div className="mt-6">
          <p className="text-text mb-3 text-sm font-semibold">
            My recent requests
          </p>
          <div className="border-border bg-surface shadow-card overflow-hidden rounded-2xl border">
            <div className="divide-border divide-y">
              {myRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div>
                    <p className="text-text text-sm font-medium">
                      {request.category} — {request.reference}
                    </p>
                    <p className="text-text-muted text-xs">
                      {formatDate(request.submittedOn)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={request.status} />
                    <span className="text-text w-28 text-right text-sm font-semibold">
                      {formatCurrency(
                        request.amountApproved ?? request.amountRequested,
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <RequestSupportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
