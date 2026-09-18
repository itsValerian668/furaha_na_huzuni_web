import { type InputHTMLAttributes, forwardRef, useId } from 'react'

import { cn } from '@/utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-text text-sm font-medium">
          {label}
          {props.required && <span className="text-negative"> *</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            'bg-surface text-text rounded-lg border px-3 py-2 text-sm',
            'focus-visible:border-brand',
            error ? 'border-negative' : 'border-border',
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-negative text-sm">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-text-muted text-sm">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  },
)
Input.displayName = 'Input'
