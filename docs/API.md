# API Integration

How React talks to Laravel: the client, the request/response contract, and
what's confirmed versus still assumed.

## Backend integration

```
┌──────────────────────────────┐
│        React Frontend        │
│  React + TypeScript + Vite   │
│  Tailwind + TanStack Query   │
│  Zustand + Axios             │
└──────────────┬───────────────┘
               │ HTTPS / REST API
               ▼
┌──────────────────────────────┐
│       Laravel Backend        │
│  Auth · Business logic       │
│  Validation · Authorization  │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│          Database            │
└──────────────────────────────┘
```

The frontend and backend are separate applications. The frontend never
accesses the database directly and contains no PHP/SQL/backend logic — the
only crossing point is the REST API.

## The Axios client

All HTTP calls go through the single instance in `src/services/api.ts`:

- Base URL comes from `VITE_API_URL` via `src/config/env.ts` (throws at
  startup if missing) — never hard-code a host in a component or service.
- `withCredentials: true` is set for Laravel Sanctum's cookie-based SPA
  auth; a bearer token is also attached from the auth store if present, so
  either Sanctum flow works without changing call sites.
- A response interceptor clears the local session on any `401`.
- `isValidationError(error)` narrows an Axios error to Laravel's 422
  validation shape; `getApiErrorMessage(error)` turns any Axios error into
  a safe, user-facing string (never leaks raw stack traces to users —
  see the [Security](#security) note).

Add a new resource by creating `src/services/<resource>.service.ts` that
imports `api` from `services/api.ts` — do not instantiate a new Axios
client or call `fetch` elsewhere.

## Request/response conventions

Shared shapes live in `src/types/api.ts`, matching Laravel's defaults:

- `PaginatedResponse<T>` — the shape of `Model::paginate()`, with
  `data`/`meta`/`links`.
- `ApiResponse<T>` — a single resource wrapped in a `data` envelope
  (Laravel API Resources).
- `ApiValidationError` — the 422 body: `{ message, errors: Record<string, string[]> }`.
- `ApiError` — the generic `{ message }` body for 401/403/404/500.

## Auth endpoints (assumed contract)

`src/services/auth.service.ts` currently assumes:

| Method | Endpoint         | Purpose            | Response          |
| ------ | ---------------- | ------------------ | ----------------- |
| `POST` | `/auth/login`    | Authenticate       | `{ user, token }` |
| `POST` | `/auth/register` | Create account     | `{ user, token }` |
| `POST` | `/auth/logout`   | Invalidate session | `204`             |
| `GET`  | `/auth/me`       | Current user       | `{ data: User }`  |

**These are assumptions, not a confirmed contract** — they're marked as
such in the source. Once the real Laravel routes exist (e.g. if Sanctum's
pure cookie flow is used instead of a bearer token, or the login response
is shaped differently), update `auth.service.ts` and `types/auth.ts`
accordingly. Do not silently build further features around unconfirmed
endpoint shapes — flag the assumption the same way.

## Adding a new endpoint

1. Define/extend the domain type in `src/types/` (or a feature-local
   `types.ts` if it's not shared).
2. Add the call to the relevant `*.service.ts` (or create one), returning
   typed data.
3. Wrap it in a TanStack Query hook under the owning feature's `hooks/`
   (`useQuery` for reads, `useMutation` for writes) — components call the
   hook, never the service directly.
4. Document the endpoint (method, path, auth requirement, request/response
   shape, status codes) next to the service call as a comment until a
   dedicated backend API doc exists, per the convention above.

## Security

- Never place secrets in `VITE_*` variables — they ship to the browser.
  No database passwords, private API keys, or Laravel app secrets in
  frontend env vars, ever.
- The frontend is not the security boundary. Client-side validation and
  route guards are UX, not authorization — Laravel enforces the real
  rules. Never bypass or disable auth checks to speed up development.
- `getApiErrorMessage()` returns a generic message for unexpected errors
  (e.g. network failures) rather than surfacing raw server output to
  users; log technical details (e.g. via your error-tracking tool of
  choice) separately from what's shown in the UI.
