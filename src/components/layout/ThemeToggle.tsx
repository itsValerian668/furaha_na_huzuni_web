import { Laptop, Moon, Sun } from 'lucide-react'

import { useThemeStore } from '@/stores/theme.store'
import { cn } from '@/utils/cn'

const OPTIONS = [
  { value: 'light', icon: Sun, label: 'Light theme' },
  { value: 'dark', icon: Moon, label: 'Dark theme' },
  { value: 'system', icon: Laptop, label: 'System theme' },
] as const

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  return (
    <div
      className="bg-surface-sunken flex items-center gap-0.5 rounded-full p-1"
      role="radiogroup"
      aria-label="Theme"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={theme === option.value}
          aria-label={option.label}
          title={option.label}
          onClick={() => setTheme(option.value)}
          className={cn(
            'flex size-7 items-center justify-center rounded-full transition-colors',
            theme === option.value
              ? 'bg-surface text-brand-strong shadow-card'
              : 'text-text-muted hover:text-text',
          )}
        >
          <option.icon className="size-3.5" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
