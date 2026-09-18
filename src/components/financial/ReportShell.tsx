import { Download, Printer } from 'lucide-react'
import type { ReactNode } from 'react'

import { StatCard } from '@/components/financial/StatCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from '@/stores/toast.store'
import type { Crumb } from '@/components/layout/Breadcrumbs'

export function ReportShell({
  title,
  description,
  breadcrumbs,
  stats,
  children,
}: {
  title: string
  description: string
  breadcrumbs: Crumb[]
  stats: Array<{
    label: string
    amount: number
    format?: 'currency' | 'count' | 'percent'
    compact?: boolean
    helperText?: string
  }>
  children: ReactNode
}) {
  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => toast('Report sent to print.')}
            >
              <Printer className="size-4" aria-hidden="true" /> Print
            </Button>
            <Button onClick={() => toast('Report exported successfully.')}>
              <Download className="size-4" aria-hidden="true" /> Export
            </Button>
          </>
        }
      />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <Input label="From" type="date" defaultValue="2026-01-01" />
        <Input label="To" type="date" defaultValue="2026-09-10" />
        <Button
          variant="secondary"
          onClick={() => toast('Report refreshed for selected date range.')}
        >
          Apply
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            amount={stat.amount}
            format={stat.format}
            compact={stat.compact}
            helperText={stat.helperText}
          />
        ))}
      </div>

      {children}
    </div>
  )
}
