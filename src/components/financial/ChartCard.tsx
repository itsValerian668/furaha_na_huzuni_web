import type { ReactNode } from 'react'

import { Card, CardHeader } from '@/components/ui/Card'

export function ChartCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader title={title} description={description} action={action} />
      <div className="px-2 pt-4 pb-5 sm:px-5">{children}</div>
    </Card>
  )
}
