import { CornerDownLeft, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/feedback/EmptyState'
import { searchAll } from '@/data/search'

export function GlobalSearchModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const results = useMemo(() => searchAll(query), [query])

  const grouped = useMemo(() => {
    const groups = new Map<string, typeof results>()
    for (const result of results) {
      const list = groups.get(result.category) ?? []
      list.push(result)
      groups.set(result.category, list)
    }
    return groups
  }, [results])

  const go = (to: string) => {
    navigate(to)
    setQuery('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Search the cooperative"
      size="lg"
    >
      <div className="relative mb-4">
        <Search
          className="text-text-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search members, transactions, loans, events, reports…"
          className="border-border bg-surface text-text placeholder:text-text-muted focus-visible:border-brand w-full rounded-lg border py-2.5 pr-3 pl-9 text-sm"
        />
      </div>

      {query && results.length === 0 && (
        <EmptyState
          title="No results found"
          description={`Nothing matches "${query}".`}
        />
      )}

      <div className="max-h-96 space-y-4 overflow-y-auto">
        {[...grouped.entries()].map(([category, items]) => (
          <div key={category}>
            <p className="text-text-muted mb-1 px-1 text-[11px] font-semibold tracking-wide uppercase">
              {category}
            </p>
            <div className="flex flex-col gap-0.5">
              {items.map((item) => (
                <button
                  key={`${item.category}-${item.id}`}
                  type="button"
                  onClick={() => go(item.to)}
                  className="hover:bg-surface-hover flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors"
                >
                  <span className="min-w-0">
                    <span className="text-text block truncate text-sm font-medium">
                      {item.title}
                    </span>
                    <span className="text-text-muted block truncate text-xs">
                      {item.subtitle}
                    </span>
                  </span>
                  <CornerDownLeft
                    className="text-text-muted size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
