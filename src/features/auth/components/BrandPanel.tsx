import { BRAND_COPY, type AuthMode } from '@/features/auth/components/brandCopy'

/** The marketing side of the split auth card. Which side it's on is decided by CSS (`.auth-card[data-mode]`), not this component. */
export function BrandPanel({ mode }: { mode: AuthMode }) {
  const copy = BRAND_COPY[mode]

  return (
    <div className="brand-panel">
      <div className="brand-content">
        <span className="brand-name">FURAHA NA HUZUNI</span>
        <span className="brand-kicker">{copy.kicker}</span>
        <h1>
          {copy.heading}
          <br />
          <em>{copy.accent}</em>
        </h1>
        <p>{copy.body}</p>
      </div>
    </div>
  )
}
