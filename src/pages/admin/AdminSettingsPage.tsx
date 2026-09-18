import { useState } from 'react'

import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Tabs } from '@/components/ui/Tabs'
import { toast } from '@/stores/toast.store'

const TABS = [
  { value: 'profile', label: 'Cooperative Profile' },
  { value: 'financial', label: 'Financial' },
  { value: 'savings', label: 'Savings Rules' },
  { value: 'shares', label: 'Shares' },
  { value: 'loans', label: 'Loans' },
  { value: 'dividends', label: 'Dividends' },
  { value: 'welfare', label: 'Welfare' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'security', label: 'Security' },
  { value: 'appearance', label: 'Appearance' },
]

function SettingsSection({
  children,
  onSave,
}: {
  children: React.ReactNode
  onSave: () => void
}) {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
      <div className="mt-6">
        <Button onClick={onSave}>Save changes</Button>
      </div>
    </Card>
  )
}

export function AdminSettingsPage() {
  const [tab, setTab] = useState('profile')
  const save = () => toast('Settings saved.')

  return (
    <div>
      <PageHeader
        title="System Settings"
        description="Configure cooperative-wide rules and preferences."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'System Settings' },
        ]}
      />

      <Tabs items={TABS} value={tab} onChange={setTab} />

      <div className="mt-6">
        {tab === 'profile' && (
          <SettingsSection onSave={save}>
            <Input
              label="Cooperative name"
              defaultValue="Furaha na Huzuni Cooperative"
            />
            <Input
              label="Registration number"
              defaultValue="SCCULT/DSM/00214"
            />
            <Input
              label="Currency"
              defaultValue="TSh — Tanzanian Shilling"
              disabled
            />
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="financial-year"
                className="text-text text-sm font-medium"
              >
                Financial year
              </label>
              <Select
                id="financial-year"
                defaultValue="jan-dec"
                options={[
                  { value: 'jan-dec', label: 'January – December' },
                  { value: 'jul-jun', label: 'July – June' },
                ]}
                className="w-full"
              />
            </div>
          </SettingsSection>
        )}

        {tab === 'financial' && (
          <SettingsSection onSave={save}>
            <Input
              label="Reserve fund rate (%)"
              type="number"
              defaultValue={20}
            />
            <Input label="Audit firm" defaultValue="Mkono & Co. Auditors" />
          </SettingsSection>
        )}

        {tab === 'savings' && (
          <SettingsSection onSave={save}>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contribution-frequency"
                className="text-text text-sm font-medium"
              >
                Contribution frequency
              </label>
              <Select
                id="contribution-frequency"
                defaultValue="weekly"
                options={[
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                ]}
                className="w-full"
              />
            </div>
            <Input
              label="Minimum weekly contribution (TSh)"
              type="number"
              defaultValue={50_000}
            />
          </SettingsSection>
        )}

        {tab === 'shares' && (
          <SettingsSection onSave={save}>
            <Input
              label="Share value (TSh)"
              type="number"
              defaultValue={5_000}
            />
            <Input
              label="Minimum shares at registration"
              type="number"
              defaultValue={10}
            />
          </SettingsSection>
        )}

        {tab === 'loans' && (
          <SettingsSection onSave={save}>
            <Input
              label="Base interest rate (% p.a.)"
              type="number"
              defaultValue={10}
            />
            <Input
              label="Maximum loan-to-savings ratio"
              type="number"
              defaultValue={3}
            />
          </SettingsSection>
        )}

        {tab === 'dividends' && (
          <SettingsSection onSave={save}>
            <Input
              label="Reserve before distribution (%)"
              type="number"
              defaultValue={20}
            />
            <Input
              label="Minimum membership tenure (months)"
              type="number"
              defaultValue={12}
            />
          </SettingsSection>
        )}

        {tab === 'welfare' && (
          <SettingsSection onSave={save}>
            <Input
              label="Monthly welfare contribution (TSh)"
              type="number"
              defaultValue={10_000}
            />
            <Input
              label="Maximum request amount (TSh)"
              type="number"
              defaultValue={1_000_000}
            />
          </SettingsSection>
        )}

        {tab === 'notifications' && (
          <SettingsSection onSave={save}>
            <Input
              label="Support email"
              type="email"
              defaultValue="support@furahanahuzuni.coop"
            />
            <Input label="SMS sender ID" defaultValue="FURAHA" />
          </SettingsSection>
        )}

        {tab === 'security' && (
          <SettingsSection onSave={save}>
            <Input
              label="Session timeout (minutes)"
              type="number"
              defaultValue={30}
            />
            <Input
              label="Minimum password length"
              type="number"
              defaultValue={8}
            />
          </SettingsSection>
        )}

        {tab === 'appearance' && (
          <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-text text-sm font-semibold">Theme</p>
              <p className="text-text-muted text-xs">
                Applies to your device only.
              </p>
            </div>
            <ThemeToggle />
          </Card>
        )}
      </div>
    </div>
  )
}
