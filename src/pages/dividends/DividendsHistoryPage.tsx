import { useNavigate } from 'react-router-dom'

import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { dividendRecords } from '@/data/dividends'
import { formatCurrency } from '@/utils/currency'

export function DividendsHistoryPage() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Dividend History"
        description="Your dividend record across every cooperative financial year."
        breadcrumbs={[
          { label: 'Dividends', to: '/dividends' },
          { label: 'History' },
        ]}
      />
      <SectionTabs
        items={[
          { label: 'Overview', to: '/dividends', end: true },
          { label: 'History', to: '/dividends/history' },
        ]}
      />

      <DataTable
        data={dividendRecords}
        keyField={(row) => row.id}
        rowActions={(row) => (
          <button
            type="button"
            onClick={() => navigate(`/dividends/${row.id}`)}
            className="text-brand-strong text-sm font-medium hover:underline"
          >
            View
          </button>
        )}
        columns={[
          {
            key: 'year',
            header: 'Financial Year',
            render: (row) => `FY${row.year}`,
          },
          {
            key: 'shares',
            header: 'Shares Held',
            render: (row) => `${row.sharesHeld} shares`,
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: 'amount',
            header: 'Dividend',
            align: 'right',
            render: (row) => (
              <span className="text-text font-semibold">
                {formatCurrency(row.personalDividend)}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}
