/**
 * Shared shapes for talking to the future Laravel API.
 * These mirror common Laravel conventions (paginated resources, 422 validation
 * error bags) so service/hook code can be written against a stable contract
 * even before the real backend exists.
 */

/** Laravel's default paginated resource response shape (paginate()). */
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}

/** A single-resource Laravel API response wrapped in a `data` envelope. */
export interface ApiResponse<T> {
  data: T
}

/** Laravel's default validation error body (422 Unprocessable Entity). */
export interface ApiValidationError {
  message: string
  errors: Record<string, string[]>
}

/** Generic Laravel error body (401/403/404/500, etc.). */
export interface ApiError {
  message: string
}
