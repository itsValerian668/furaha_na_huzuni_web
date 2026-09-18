import { Download, Printer, Share2 } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'
import { currentMember } from '@/data/members'
import { toast } from '@/stores/toast.store'
import { formatDate } from '@/utils/date'
import type { Crumb } from '@/components/layout/Breadcrumbs'

export function StatementDocument({
  title,
  breadcrumbs,
  summary,
  children,
}: {
  title: string
  breadcrumbs: Crumb[]
  summary: Array<{ label: string; value: string }>
  children: ReactNode
}) {
  return (
    <div>
      <PageHeader
        title={title}
        description={`Generated ${formatDate(new Date())} for ${currentMember.name}`}
        breadcrumbs={breadcrumbs}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => toast('Statement sent to print.')}
            >
              <Printer className="size-4" aria-hidden="true" /> Print
            </Button>
            <Button
              variant="secondary"
              onClick={() => toast('Statement exported as CSV.')}
            >
              <Share2 className="size-4" aria-hidden="true" /> Export
            </Button>
            <Button onClick={() => toast('Statement downloaded as PDF.')}>
              <Download className="size-4" aria-hidden="true" /> Download PDF
            </Button>
          </>
        }
      />

      <Card className="mb-6 p-5">
        <div className="border-border mb-4 flex flex-col justify-between gap-1 border-b pb-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-text text-sm font-semibold">
              {currentMember.name}
            </p>
            <p className="text-text-muted text-xs">
              {currentMember.memberNumber} · {currentMember.branch}
            </p>
          </div>
          <p className="text-text-muted text-xs">
            Furaha na Huzuni Cooperative
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {summary.map((item) => (
            <div key={item.label}>
              <dt className="text-text-muted text-xs">{item.label}</dt>
              <dd className="text-text text-sm font-semibold">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {children}
    </div>
  )
}
