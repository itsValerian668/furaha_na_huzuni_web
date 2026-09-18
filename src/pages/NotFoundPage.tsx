import { ArrowLeft, Compass } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-bg flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
      <span className="bg-brand-soft text-brand-strong flex size-16 items-center justify-center rounded-full">
        <Compass className="size-7" aria-hidden="true" />
      </span>
      <div>
        <p className="text-brand-strong text-sm font-semibold tracking-wide uppercase">
          404
        </p>
        <h1 className="text-text mt-1 text-2xl font-bold">
          This page isn't part of the cooperative.
        </h1>
        <p className="text-text-muted mt-2 text-sm">
          Let's get you back to your dashboard.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="border-border bg-surface text-text hover:bg-surface-hover inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Go back
        </button>
        <Link
          to="/dashboard"
          className="bg-brand text-on-brand hover:bg-brand-strong inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
