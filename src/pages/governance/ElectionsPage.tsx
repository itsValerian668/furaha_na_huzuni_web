import { CheckCircle2, Vote } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { electionPositions } from '@/data/governance'
import { toast } from '@/stores/toast.store'
import { formatDate } from '@/utils/date'

export function ElectionsPage() {
  const [votes, setVotes] = useState<Record<string, string>>({})

  const castVote = (positionId: string, candidateId: string) => {
    setVotes((current) => ({ ...current, [positionId]: candidateId }))
    toast('Your vote has been recorded.')
  }

  return (
    <div>
      <PageHeader
        title="Elections"
        description="Vote for cooperative leadership positions."
        breadcrumbs={[
          { label: 'Governance', to: '/governance' },
          { label: 'Elections' },
        ]}
      />

      <div className="flex flex-col gap-6">
        {electionPositions.map((position) => {
          const totalVotes = position.candidates.reduce(
            (sum, candidate) => sum + candidate.votes,
            0,
          )
          const myVote = votes[position.id]

          return (
            <Card key={position.id} className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-text flex items-center gap-2 text-base font-semibold">
                    <Vote className="text-brand size-4" aria-hidden="true" />{' '}
                    {position.title}
                  </p>
                  <p className="text-text-muted mt-1 text-xs">
                    Voting closes {formatDate(position.closesOn)}
                  </p>
                </div>
                <StatusBadge status={position.status} />
              </div>

              <div className="flex flex-col gap-3">
                {position.candidates.map((candidate) => {
                  const percent =
                    totalVotes > 0
                      ? Math.round((candidate.votes / totalVotes) * 100)
                      : 0
                  const isSelected = myVote === candidate.id
                  return (
                    <div
                      key={candidate.id}
                      className="border-border rounded-xl border p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-text text-sm font-semibold">
                            {candidate.name}
                          </p>
                          <p className="text-text-muted mt-0.5 text-xs">
                            {candidate.statement}
                          </p>
                        </div>
                        {position.status === 'OPEN' ? (
                          <Button
                            variant={isSelected ? 'primary' : 'secondary'}
                            onClick={() => castVote(position.id, candidate.id)}
                            disabled={Boolean(myVote)}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2
                                  className="size-4"
                                  aria-hidden="true"
                                />{' '}
                                Voted
                              </>
                            ) : (
                              'Vote'
                            )}
                          </Button>
                        ) : (
                          <span className="text-text text-sm font-semibold">
                            {percent}%
                          </span>
                        )}
                      </div>
                      <div className="bg-surface-sunken mt-3 h-1.5 w-full overflow-hidden rounded-full">
                        <div
                          className="bg-brand h-full rounded-full transition-[width] duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-text-muted mt-1 text-xs">
                        {candidate.votes} votes
                      </p>
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
