import type { ReactNode } from 'react'

import { Breadcrumbs, type Crumb } from '@/components/layout/Breadcrumbs'

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: {
  title: string
  description?: string
  actions?: ReactNode
  breadcrumbs?: Crumb[]
}) {
  return (
    <div className="mb-6">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-text text-2xl font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-text-muted mt-1 text-sm">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
        )}
      </div>
    </div>
  )
}
