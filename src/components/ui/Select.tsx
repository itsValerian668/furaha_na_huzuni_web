import { ChevronDown } from 'lucide-react'
import type { SelectHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

export interface SelectOption {
  value: string
  label: string
}

export function Select({
  options,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { options: SelectOption[] }) {
  return (
    <div className="relative">
      <select
        className={cn(
          'border-border bg-surface text-text focus-visible:border-brand appearance-none rounded-lg border py-2 pr-8 pl-3 text-sm',
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="text-text-muted pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2"
        aria-hidden="true"
      />
    </div>
  )
}
