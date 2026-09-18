import type { CSSProperties } from 'react'

import { BRAND_COPY, type AuthMode } from '@/features/auth/components/brandCopy'

/** Sweep timing — exported so AuthPage can time its mode-swap/reset timeouts off the same source of truth. */
export const BLADE_SWEEP_MS = 900
const SWEEP_EASING = 'cubic-bezier(0.77, 0, 0.175, 1)'
/** Unskewed — the wipe edge stays a straight vertical line instead of cutting across at an angle. */
const RAKE = '0deg'

/** Percentage translateX values, expressed against the blade's own (full-card) width. */
const HIDDEN_X = '-100%'
const SWEPT_X = '100%'

export interface AuthBladeProps {
  /** Which mode's copy to preview — the blade always shows the copy for the destination it's revealing. */
  mode: AuthMode
  /** true once the sweep has been triggered (rest = off-screen left, swept = off-screen right). */
  swept: boolean
  /** true only for the instant reset back to rest after a sweep completes — suppresses the transition so it doesn't visibly sweep back. */
  instant: boolean
}

/**
 * The animated skewed panel that wipes across the card between LoginForm
 * and SignupForm. It's a reveal mask, not a moving label — see the comment
 * in AuthPage.css above `.auth-blade` for how the counter-transform on
 * `.blade-inner` keeps the preview content fixed in card-coordinates while
 * only the mask itself moves. Purely decorative — aria-hidden.
 */
export function AuthBlade({ mode, swept, instant }: AuthBladeProps) {
  const copy = BRAND_COPY[mode]

  const style: CSSProperties & Record<'--rake' | '--sweep', string> = {
    '--rake': RAKE,
    '--sweep': swept ? SWEPT_X : HIDDEN_X,
    // Transition the custom property itself (registered via `@property` in
    // AuthPage.css), not `transform` — see the comment there for why: both
    // this element's transform AND .blade-inner's counter-transform read
    // var(--sweep), and they need to see the same interpolating value on
    // every frame to stay in sync.
    transition: instant
      ? 'none'
      : `--sweep ${BLADE_SWEEP_MS}ms ${SWEEP_EASING}`,
  }

  return (
    <div
      className="auth-blade"
      data-preview={mode}
      aria-hidden="true"
      style={style}
    >
      <div className="blade-inner">
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
    </div>
  )
}
