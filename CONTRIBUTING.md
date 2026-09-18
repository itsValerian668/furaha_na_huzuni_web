# Contributing

## Before submitting changes

```bash
npm run lint
npm run test
npm run build
```

All three must pass cleanly. See [DEVELOPMENT.md](./DEVELOPMENT.md) for the
full command list and the code-quality checklist.

## Git workflow

Branch names should be meaningful:

```
main
develop
feature/authentication
feature/dashboard
feature/user-management
fix/login-validation
refactor/api-client
```

## Commit convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add authentication flow
feat: add dashboard navigation
fix: handle expired authentication session
fix: resolve mobile navigation issue
refactor: simplify API client
style: improve dashboard spacing
test: add login form tests
docs: update API documentation
chore: update dependencies
```

Keep commits focused — avoid bundling unrelated changes into one commit.

## Naming conventions

| Kind       | Convention                                    | Examples                                             |
| ---------- | --------------------------------------------- | ---------------------------------------------------- |
| Components | PascalCase                                    | `UserProfile.tsx`, `DataTable.tsx`                   |
| Hooks      | camelCase, `use` prefix                       | `useAuth.ts`, `useDebounce.ts`                       |
| Services   | `<resource>.service.ts`                       | `auth.service.ts`, `user.service.ts`                 |
| Types      | descriptive, PascalCase types in a topic file | `types/auth.ts` exporting `User`, `LoginCredentials` |

## Testing expectations

Vitest + React Testing Library. Prioritize:

- Authentication flows
- Forms and validation
- Business logic and utilities
- Reusable UI components (see `src/components/ui/Button.test.tsx` for the
  pattern: behavior — what a user can do — not implementation details)
- Critical user workflows
- API-related behavior (error handling, validation-error mapping)

## Pull request checklist

- [ ] Follows the architecture in [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [ ] Follows naming conventions above
- [ ] Tests included where appropriate
- [ ] No unrelated files touched
- [ ] Documentation updated if the change affects architecture, API
      contracts, or setup (`docs/ARCHITECTURE.md`, `docs/API.md`, `README.md`)
- [ ] Commit messages follow the convention above
