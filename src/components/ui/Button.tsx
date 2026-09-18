import { Loader2 } from 'lucide-react'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/utils/cn'

const VARIANT_CLASSES = {
  primary:
    'bg-brand text-on-brand hover:bg-brand-strong focus-visible:ring-brand disabled:opacity-50',
  gold: 'bg-accent text-forest-deep hover:brightness-95 focus-visible:ring-accent disabled:opacity-50',
  secondary:
    'bg-surface text-text border border-border hover:bg-surface-hover disabled:opacity-50',
  danger: 'bg-negative text-white hover:brightness-90 disabled:opacity-50',
  ghost: 'text-text hover:bg-surface-hover disabled:opacity-50',
} as const

export type ButtonVariant = keyof typeof VARIANT_CLASSES

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      isLoading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={props.type ?? 'button'}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
          'focus-visible:ring-offset-bg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:cursor-not-allowed',
          VARIANT_CLASSES[variant],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
