import { MemberAvatar } from '@/components/layout/MemberAvatar'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { leaders } from '@/data/governance'
import { formatDate } from '@/utils/date'

const COMMITTEES = [
  'Executive',
  'Loan Committee',
  'Welfare Committee',
  'Supervisory Committee',
]

export function LeadersPage() {
  return (
    <div>
      <PageHeader
        title="Cooperative Leaders"
        description="Elected members leading each committee."
        breadcrumbs={[
          { label: 'Governance', to: '/governance' },
          { label: 'Leaders' },
        ]}
      />

      <div className="flex flex-col gap-8">
        {COMMITTEES.map((committee) => {
          const members = leaders.filter(
            (leader) => leader.committee === committee,
          )
          if (members.length === 0) return null
          return (
            <div key={committee}>
              <p className="text-text mb-3 text-sm font-semibold">
                {committee}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((leader) => (
                  <Card key={leader.id} className="flex items-center gap-3 p-4">
                    <MemberAvatar
                      name={leader.name}
                      color={leader.avatarColor}
                      size={44}
                    />
                    <div>
                      <p className="text-text text-sm font-semibold">
                        {leader.name}
                      </p>
                      <p className="text-brand-strong text-xs font-medium">
                        {leader.position}
                      </p>
                      <p className="text-text-muted text-xs">
                        Since {formatDate(leader.since)}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
