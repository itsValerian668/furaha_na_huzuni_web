import { Camera, CheckCircle2, Download, FileText } from 'lucide-react'
import { useState } from 'react'

import { MemberAvatar } from '@/components/layout/MemberAvatar'
import { PageHeader } from '@/components/layout/PageHeader'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Tabs } from '@/components/ui/Tabs'
import { getMemberTransactions } from '@/data/transactions'
import { currentMember } from '@/data/members'
import { toast } from '@/stores/toast.store'
import { useAuthStore } from '@/stores/auth.store'
import { formatCurrency } from '@/utils/currency'
import { formatDate, formatDateTime } from '@/utils/date'

const TABS = [
  { value: 'personal', label: 'Personal' },
  { value: 'membership', label: 'Membership' },
  { value: 'financial', label: 'Financial' },
  { value: 'beneficiaries', label: 'Beneficiaries' },
  { value: 'documents', label: 'Documents' },
  { value: 'activity', label: 'Activity' },
  { value: 'settings', label: 'Settings' },
]

export function ProfilePage() {
  const [tab, setTab] = useState('personal')
  const user = useAuthStore((state) => state.user)
  const activity = getMemberTransactions(currentMember.id).slice(0, 6)

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Your personal, membership and financial information."
        breadcrumbs={[{ label: 'Profile' }]}
      />

      <Card className="mb-6 flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
        <div className="relative">
          <MemberAvatar
            name={user?.name ?? currentMember.name}
            color={currentMember.avatarColor}
            size={72}
          />
          <button
            type="button"
            onClick={() => toast('Profile photo updated.')}
            aria-label="Change profile photo"
            className="border-surface bg-brand text-on-brand absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border-2"
          >
            <Camera className="size-3.5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1">
          <p className="text-text text-lg font-bold">
            {user?.name ?? currentMember.name}
          </p>
          <p className="text-text-muted text-sm">
            {currentMember.memberNumber} · {currentMember.branch}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            <StatusBadge status={currentMember.status} />
            <StatusBadge status={currentMember.welfareStatus} />
          </div>
        </div>
      </Card>

      <Tabs items={TABS} value={tab} onChange={setTab} />

      <div className="mt-6">
        {tab === 'personal' && (
          <Card className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <Input
              label="Full name"
              defaultValue={user?.name ?? currentMember.name}
            />
            <Input
              label="Email"
              type="email"
              defaultValue={user?.email ?? currentMember.email}
            />
            <Input label="Phone" defaultValue={currentMember.phone} />
            <Input label="Address" defaultValue={currentMember.address} />
            <Input label="Occupation" defaultValue={currentMember.occupation} />
            <div className="sm:col-span-2">
              <Button onClick={() => toast('Profile updated successfully.')}>
                Save changes
              </Button>
            </div>
          </Card>
        )}

        {tab === 'membership' && (
          <Card className="p-6">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-text-muted text-xs">Member Number</dt>
                <dd className="text-text text-sm font-semibold">
                  {currentMember.memberNumber}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Membership Date</dt>
                <dd className="text-text text-sm font-semibold">
                  {formatDate(currentMember.joinedOn)}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Member Status</dt>
                <dd>
                  <StatusBadge status={currentMember.status} />
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Branch</dt>
                <dd className="text-text text-sm font-semibold">
                  {currentMember.branch}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Role</dt>
                <dd className="text-text text-sm font-semibold">
                  {currentMember.role.replace('_', ' ')}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Welfare Standing</dt>
                <dd>
                  <StatusBadge status={currentMember.welfareStatus} />
                </dd>
              </div>
            </dl>
          </Card>
        )}

        {tab === 'financial' && (
          <Card className="p-6">
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <dt className="text-text-muted text-xs">Savings</dt>
                <dd className="text-text text-sm font-semibold">
                  {formatCurrency(currentMember.totalSavings)}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Shares</dt>
                <dd className="text-text text-sm font-semibold">
                  {currentMember.totalShares} ·{' '}
                  {formatCurrency(currentMember.shareValue)}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Outstanding Loan</dt>
                <dd className="text-text text-sm font-semibold">
                  {formatCurrency(currentMember.outstandingLoan)}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Loan Status</dt>
                <dd>
                  <StatusBadge
                    status={
                      currentMember.outstandingLoan > 0 ? 'ACTIVE' : 'COMPLETED'
                    }
                  />
                </dd>
              </div>
            </dl>
          </Card>
        )}

        {tab === 'beneficiaries' && (
          <Card className="p-6">
            <p className="text-text mb-3 text-sm font-semibold">
              Next of kin & emergency contact
            </p>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-text-muted text-xs">Next of Kin</dt>
                <dd className="text-text text-sm font-semibold">
                  {currentMember.nextOfKin}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Emergency Contact</dt>
                <dd className="text-text text-sm font-semibold">
                  {currentMember.phone}
                </dd>
              </div>
            </dl>
          </Card>
        )}

        {tab === 'documents' && (
          <Card className="divide-border divide-y p-0">
            {[
              'National ID',
              'Membership Application Form',
              'Signed Constitution Acknowledgement',
            ].map((doc) => (
              <div
                key={doc}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <FileText
                    className="text-text-muted size-4"
                    aria-hidden="true"
                  />
                  <span className="text-text text-sm font-medium">{doc}</span>
                  <CheckCircle2
                    className="text-positive size-3.5"
                    aria-hidden="true"
                  />
                </div>
                <Button
                  variant="ghost"
                  onClick={() => toast(`${doc} downloaded.`)}
                >
                  <Download className="size-4" aria-hidden="true" />
                </Button>
              </div>
            ))}
          </Card>
        )}

        {tab === 'activity' && (
          <Card className="divide-border divide-y p-0">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div>
                  <p className="text-text text-sm font-medium">
                    {item.description}
                  </p>
                  <p className="text-text-muted text-xs">
                    {formatDateTime(item.date)}
                  </p>
                </div>
                <span className="text-text text-sm font-semibold">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </Card>
        )}

        {tab === 'settings' && (
          <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-text text-sm font-semibold">Appearance</p>
              <p className="text-text-muted text-xs">
                Choose how Furaha na Huzuni looks on this device.
              </p>
            </div>
            <ThemeToggle />
          </Card>
        )}
      </div>
    </div>
  )
}
