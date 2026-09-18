import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/utils/cn'

export function Pagination({
  page,
  pageCount,
  onChange,
  totalItems,
  pageSize,
}: {
  page: number
  pageCount: number
  onChange: (page: number) => void
  totalItems: number
  pageSize: number
}) {
  if (pageCount <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(totalItems, page * pageSize)

  return (
    <div className="border-border flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-text-muted text-sm">
        Showing{' '}
        <span className="text-text font-medium">
          {start}–{end}
        </span>{' '}
        of <span className="text-text font-medium">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="text-text-muted hover:bg-surface-hover rounded-md p-1.5 transition-colors disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        {Array.from({ length: pageCount }, (_, index) => index + 1)
          .filter(
            (item) =>
              item === 1 || item === pageCount || Math.abs(item - page) <= 1,
          )
          .reduce<number[]>((acc, item) => {
            const previous = acc[acc.length - 1]
            if (previous !== undefined && item - previous > 1) acc.push(-1)
            acc.push(item)
            return acc
          }, [])
          .map((item, index) =>
            item === -1 ? (
              <span
                key={`gap-${index}`}
                className="text-text-muted px-1.5 text-sm"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onChange(item)}
                aria-current={item === page ? 'page' : undefined}
                className={cn(
                  'min-w-8 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
                  item === page
                    ? 'bg-brand text-on-brand'
                    : 'text-text-muted hover:bg-surface-hover hover:text-text',
                )}
              >
                {item}
              </button>
            ),
          )}
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page === pageCount}
          aria-label="Next page"
          className="text-text-muted hover:bg-surface-hover rounded-md p-1.5 transition-colors disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
