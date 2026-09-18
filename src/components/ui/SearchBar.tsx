import { Search, X } from 'lucide-react'

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={className}>
      <label className="sr-only" htmlFor="search-bar">
        {placeholder}
      </label>
      <div className="relative">
        <Search
          className="text-text-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          id="search-bar"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="border-border bg-surface text-text placeholder:text-text-muted focus-visible:border-brand w-full rounded-lg border py-2 pr-9 pl-9 text-sm"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="text-text-muted hover:text-text absolute top-1/2 right-2.5 -translate-y-1/2"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
