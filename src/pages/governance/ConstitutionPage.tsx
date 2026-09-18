import { useState } from 'react'

import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'
import { constitutionSections } from '@/data/governance'
import { cn } from '@/utils/cn'

export function ConstitutionPage() {
  const [activeId, setActiveId] = useState(constitutionSections[0]!.id)
  const activeSection = constitutionSections.find(
    (section) => section.id === activeId,
  )!

  return (
    <div>
      <PageHeader
        title="Constitution"
        description="The governing rules of Furaha na Huzuni Cooperative."
        breadcrumbs={[
          { label: 'Governance', to: '/governance' },
          { label: 'Constitution' },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <nav aria-label="Constitution sections" className="lg:col-span-1">
          <ul className="flex flex-col gap-0.5">
            {constitutionSections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(section.id)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    section.id === activeId
                      ? 'bg-brand-soft text-brand-strong font-medium'
                      : 'text-text-muted hover:bg-surface-hover',
                  )}
                >
                  <span className="text-xs opacity-70">{section.number}.</span>{' '}
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <Card className="p-6 lg:col-span-3">
          <p className="text-brand-strong text-xs font-semibold tracking-wide uppercase">
            Section {activeSection.number}
          </p>
          <h2 className="text-text mt-1 text-xl font-bold">
            {activeSection.title}
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {activeSection.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-text-muted text-sm leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
