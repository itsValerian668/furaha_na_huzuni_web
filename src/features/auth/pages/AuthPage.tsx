import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { AuthBlade, BLADE_SWEEP_MS } from '@/features/auth/components/AuthBlade'
import { BrandPanel } from '@/features/auth/components/BrandPanel'
import type { AuthMode } from '@/features/auth/components/brandCopy'
import { FormPanel } from '@/features/auth/components/FormPanel'
import { useIsAuthenticated } from '@/stores/auth.store'

import '@/features/auth/AuthPage.css'

/**
 * The blade sweeps left→right across the card (covering it) regardless of
 * which direction the mode is switching — the CSS-driven original encoded
 * this as four `.is-signup`/`.is-animating` class combinations, but three
 * of those four resolve to the same two transform values, so it's simpler
 * (and avoids an unintended second sweep back across the card once the
 * reveal completes) to drive it directly off two booleans here instead.
 */
const CONTENT_SWAP_MS = 430

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function AuthPage() {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  // `mode` drives the real, settled panels (flips mid-sweep, once covered).
  // `previewMode` drives the blade — it needs the destination from the very
  // start of the sweep, since it's revealing that content the whole way,
  // not just after the real panels have caught up.
  const [mode, setMode] = useState<AuthMode>('login')
  const [previewMode, setPreviewMode] = useState<AuthMode>('login')
  const [isSwitching, setIsSwitching] = useState(false)
  const [bladeSwept, setBladeSwept] = useState(false)
  const [bladeInstant, setBladeInstant] = useState(false)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const timeouts = timeoutsRef.current
    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [])

  const switchMode = () => {
    if (isSwitching) return

    const next: AuthMode = mode === 'login' ? 'signup' : 'login'

    if (prefersReducedMotion()) {
      setMode(next)
      setPreviewMode(next)
      return
    }

    setIsSwitching(true)
    setBladeInstant(false)
    setBladeSwept(true)
    setPreviewMode(next)

    const swapTimeout = setTimeout(() => {
      setMode(next)
    }, CONTENT_SWAP_MS)

    const resetTimeout = setTimeout(() => {
      setBladeInstant(true)
      setBladeSwept(false)
      setIsSwitching(false)
      requestAnimationFrame(() => setBladeInstant(false))
    }, BLADE_SWEEP_MS)

    timeoutsRef.current.push(swapTimeout, resetTimeout)
  }

  if (isAuthenticated) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/'
    return <Navigate to={redirectTo} replace />
  }

  return (
    <main className="auth-page">
      <div className="auth-card" data-mode={mode}>
        <BrandPanel mode={mode} />

        <FormPanel
          mode={mode}
          switching={isSwitching}
          onSwitchToSignup={switchMode}
          onSwitchToLogin={switchMode}
        />

        <AuthBlade
          mode={previewMode}
          swept={bladeSwept}
          instant={bladeInstant}
        />
      </div>

      <p className="auth-caption">
        By continuing you agree to our Terms and Privacy Policy.
      </p>
    </main>
  )
}
