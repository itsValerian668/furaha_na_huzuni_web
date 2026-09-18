import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'

import { Pagination } from '@/components/ui/Pagination'
import { SearchBar } from '@/components/ui/SearchBar'
import { EmptyState } from '@/components/feedback/EmptyState'
import { cn } from '@/utils/cn'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
  headerClassName?: string
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  searchPlaceholder = 'Search…',
  searchFields,
  filters,
  pageSize = 8,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search or filters.',
  rowActions,
  toolbar,
}: {
  columns: DataTableColumn<T>[]
  data: T[]
  keyField: (row: T) => string
  searchPlaceholder?: string
  searchFields?: (row: T) => string[]
  filters?: ReactNode
  pageSize?: number
  emptyTitle?: string
  emptyDescription?: string
  rowActions?: (row: T) => ReactNode
  toolbar?: ReactNode
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!search || !searchFields) return data
    const needle = search.toLowerCase()
    return data.filter((row) =>
      searchFields(row).some((field) => field.toLowerCase().includes(needle)),
    )
  }, [data, search, searchFields])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  return (
    <div className="border-border bg-surface shadow-card overflow-hidden rounded-2xl border">
      {(searchFields || filters || toolbar) && (
        <div className="border-border flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {searchFields && (
              <SearchBar
                value={search}
                onChange={(value) => {
                  setSearch(value)
                  setPage(1)
                }}
                placeholder={searchPlaceholder}
                className="w-full sm:max-w-xs"
              />
            )}
            {filters}
          </div>
          {toolbar}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="p-6">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-sm">
              <thead>
                <tr className="border-border bg-surface-sunken/60 border-b">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={cn(
                        'text-text-muted px-4 py-3 text-xs font-semibold tracking-wide uppercase',
                        column.align === 'right' && 'text-right',
                        column.align === 'center' && 'text-center',
                        column.headerClassName,
                      )}
                    >
                      {column.header}
                    </th>
                  ))}
                  {rowActions && <th className="px-4 py-3" />}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr
                    key={keyField(row)}
                    className="border-border hover:bg-surface-hover border-b last:border-b-0"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          'text-text px-4 py-3.5',
                          column.align === 'right' && 'text-right',
                          column.align === 'center' && 'text-center',
                          column.className,
                        )}
                      >
                        {column.render(row)}
                      </td>
                    ))}
                    {rowActions && (
                      <td className="px-4 py-3.5 text-right">
                        {rowActions(row)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onChange={setPage}
            totalItems={filtered.length}
            pageSize={pageSize}
          />
        </>
      )}
    </div>
  )
}
