import { Eye, Lock } from 'lucide-react'
import { type InputHTMLAttributes, forwardRef, useId, useState } from 'react'

import { cn } from '@/utils/cn'

export interface AuthPasswordFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label: string
  error?: string
}

/** AuthField's password variant: the trailing icon doubles as a show/hide toggle. */
export const AuthPasswordField = forwardRef<
  HTMLInputElement,
  AuthPasswordFieldProps
>(({ label, error, id, className, ...props }, ref) => {
  const [visible, setVisible] = useState(false)
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className="auth-field">
      <label htmlFor={inputId}>{label}</label>
      <div className={cn('field-wrapper', error && 'has-error')}>
        <input
          ref={ref}
          id={inputId}
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={className}
          {...props}
        />
        <button
          type="button"
          className="field-icon is-button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <Eye aria-hidden="true" /> : <Lock aria-hidden="true" />}
        </button>
      </div>
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </div>
  )
})
AuthPasswordField.displayName = 'AuthPasswordField'
