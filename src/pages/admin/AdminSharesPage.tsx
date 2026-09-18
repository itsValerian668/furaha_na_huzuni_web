import { Plus } from 'lucide-react'

import { StatCard } from '@/components/financial/StatCard'
import { DataTable } from '@/components/tables/DataTable'
import { MemberAvatar } from '@/components/layout/MemberAvatar'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { adminOverview } from '@/data/admin'
import { members } from '@/data/members'
import { shareOverview } from '@/data/shares'
import { toast } from '@/stores/toast.store'
import { formatCurrency } from '@/utils/currency'

export function AdminSharesPage() {
  const totalShares = members.reduce(
    (sum, member) => sum + member.totalShares,
    0,
  )

  return (
    <div>
      <PageHeader
        title="Share Management"
        description="Track share capital and issue new shares to members."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Shares' },
        ]}
        actions={
          <Button onClick={() => toast('Shares issued successfully.')}>
            <Plus className="size-4" aria-hidden="true" /> Issue Shares
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Share Capital"
          amount={adminOverview.shareCapital}
          compact
          tone="gold"
        />
        <StatCard
          label="Total Shares"
          amount={totalShares}
          format="count"
          tone="neutral"
        />
        <StatCard label="Share Value" amount={shareOverview.shareValue} />
        <StatCard
          label="New Shares (this year)"
          amount={members.length * 40}
          format="count"
          tone="neutral"
        />
      </div>

      <DataTable
        data={members}
        keyField={(row) => row.id}
        searchFields={(row) => [row.name, row.memberNumber]}
        searchPlaceholder="Search members…"
        toolbar={
          <Button
            variant="secondary"
            onClick={() => toast('Share register exported.')}
          >
            Export
          </Button>
        }
        rowActions={() => (
          <button
            type="button"
            onClick={() => toast('Share purchase approved.')}
            className="text-brand-strong text-sm font-medium hover:underline"
          >
            Approve
          </button>
        )}
        columns={[
          {
            key: 'name',
            header: 'Member',
            render: (row) => (
              <span className="flex items-center gap-2.5">
                <MemberAvatar
                  name={row.name}
                  color={row.avatarColor}
                  size={28}
                />
                <span className="text-text font-medium">{row.name}</span>
              </span>
            ),
          },
          {
            key: 'shares',
            header: 'Shares',
            render: (row) => `${row.totalShares} shares`,
          },
          {
            key: 'value',
            header: 'Value',
            align: 'right',
            render: (row) => (
              <span className="text-text font-semibold">
                {formatCurrency(row.shareValue)}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}
