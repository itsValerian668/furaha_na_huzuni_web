# Development

## Setup

```bash
npm install
cp .env.example .env   # adjust VITE_API_URL if needed
npm run dev
```

## Environment variables

| Variable       | Purpose                          | Example                                                                                                            |
| -------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `VITE_API_URL` | Base URL of the Laravel REST API | `http://localhost:8000/api` (dev) · `https://staging.example.com/api` (staging) · `https://example.com/api` (prod) |

`.env` is git-ignored; `.env.example` is the committed template. Switching
environments (dev/staging/prod) is a configuration change — never
hard-code an API host in application code. Production values are supplied
by the deployment environment, not committed.

## Commands

| Command                           | Purpose                               |
| --------------------------------- | ------------------------------------- |
| `npm run dev`                     | Start the dev server                  |
| `npm run build`                   | Type-check and build for production   |
| `npm run preview`                 | Preview the production build locally  |
| `npm run typecheck`               | Type-check without emitting           |
| `npm run lint` / `lint:fix`       | Lint (and auto-fix)                   |
| `npm run format` / `format:check` | Format with Prettier (and check only) |
| `npm run test`                    | Run the test suite once               |
| `npm run test:watch`              | Run tests in watch mode               |
| `npm run test:ui`                 | Run tests with the Vitest UI          |

## Workflow for a new feature

1. **Understand.** Inspect existing architecture, related components,
   hooks, services, stores, types, and routes before writing anything —
   see [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md). Reuse before adding.
2. **Plan.** Identify: components needed, API requirements (does the
   endpoint exist? — see [docs/API.md](./docs/API.md)), state requirements (server
   vs. client, see docs/ARCHITECTURE.md#state-management), validation, responsive
   behavior, and loading/empty/error states.
3. **Implement.** Type-safe, focused, reusing existing primitives from
   `components/ui/` and `components/feedback/` where they fit.
4. **Verify** (see below).
5. **Review.** UI, responsiveness, accessibility, performance, security,
   maintainability — the [checklist](#code-quality-checklist) below.

## Verify before calling something done

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

The production build must complete with zero TypeScript, ESLint, or build
errors. For any UI change, also run it in an actual browser (`npm run dev`)
and check the golden path plus edge cases — passing tests confirms
correctness, not that the feature looks/feels right.

## Code quality checklist

Before considering a feature complete:

- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Prettier formatting is clean (`npm run format:check`)
- [ ] Tests added where appropriate and passing (`npm run test`)
- [ ] Responsive behavior verified (mobile → large desktop)
- [ ] Accessibility considered (semantic HTML, labels, keyboard nav, focus states)
- [ ] Loading, empty, and error states handled — see docs/ARCHITECTURE.md#error--loading--empty-states
- [ ] API errors handled via `getApiErrorMessage`/`isValidationError`, not left unhandled
- [ ] No stray `console.log` (warn/error are allowed by lint config)
- [ ] No unused imports/variables
- [ ] No obvious duplicated logic that belongs in a shared hook/component/util

## Anti-patterns to avoid

- Massive, do-everything components
- Duplicate API-calling logic instead of a shared service/hook
- Hard-coded API URLs or secrets
- Reaching for global (Zustand) state before local state is ruled out
- Excessive `any` or type assertions to silence the compiler
- Adding a dependency (or a second UI/CSS framework) without a strong reason
- Business logic embedded in presentation components
- Unhandled API errors / blank loading screens
- Desktop-only layouts, or clickable `<div>`s where a `<button>`/`<a>` belongs
