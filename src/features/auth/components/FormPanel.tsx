import { LoginForm } from '@/features/auth/components/LoginForm'
import { SignupForm } from '@/features/auth/components/SignupForm'

type AuthMode = 'login' | 'signup'

export interface FormPanelProps {
  mode: AuthMode
  switching: boolean
  onSwitchToSignup: () => void
  onSwitchToLogin: () => void
}

/** Hosts whichever form is active. `aria-live` so screen readers announce the mode change. */
export function FormPanel({
  mode,
  switching,
  onSwitchToSignup,
  onSwitchToLogin,
}: FormPanelProps) {
  return (
    <div className="form-panel" aria-live="polite">
      {mode === 'login' ? (
        <LoginForm onSwitchToSignup={onSwitchToSignup} switching={switching} />
      ) : (
        <SignupForm onSwitchToLogin={onSwitchToLogin} switching={switching} />
      )}
    </div>
  )
}
