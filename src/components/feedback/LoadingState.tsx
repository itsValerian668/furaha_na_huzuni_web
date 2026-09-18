import { Spinner } from '@/components/ui/Spinner'

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Spinner className="text-brand size-6" />
      <p className="text-text-muted text-sm">{label}</p>
    </div>
  )
}
