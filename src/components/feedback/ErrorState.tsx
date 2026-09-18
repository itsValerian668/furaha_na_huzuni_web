import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/Button'

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="border-negative/20 bg-negative-soft flex flex-col items-center gap-3 rounded-xl border px-6 py-12 text-center">
      <AlertTriangle className="text-negative size-8" aria-hidden="true" />
      <p className="text-negative text-sm font-medium">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
