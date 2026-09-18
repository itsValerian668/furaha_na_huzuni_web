import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-2">
      <ol className="text-text-muted flex flex-wrap items-center gap-1.5 text-xs">
        <li className="flex items-center gap-1.5">
          <Link
            to="/dashboard"
            className="hover:text-text flex items-center"
            aria-label="Dashboard"
          >
            <Home className="size-3.5" aria-hidden="true" />
          </Link>
          <ChevronRight className="size-3" aria-hidden="true" />
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.to && !isLast ? (
                <Link to={item.to} className="hover:text-text">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'text-text font-medium' : ''}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="size-3" aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
