import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
} from 'react'

import { cn } from '@/utils/cn'

export interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: ReactNode
  error?: string
}

/** Underline-style labeled field with a right-aligned icon — the input pattern for this page's editorial design. */
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, icon, error, id, className, ...props }, ref) => {
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
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={className}
            {...props}
          />
          <span className="field-icon" aria-hidden="true">
            {icon}
          </span>
        </div>
        {error && (
          <p id={errorId} className="field-error">
            {error}
          </p>
        )}
      </div>
    )
  },
)
AuthField.displayName = 'AuthField'
