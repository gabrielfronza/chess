# Agent Guide

## Execution contract

- Work on one story at a time.
- Read `README.md`, `docs/ARCHITECTURE.md`, and the story file.
- Do not implement items explicitly outside the scope.
- Preserve financial invariants and idempotency.
- Do not log secrets, tokens, or personal data.
- Create compatible migrations and include tests for business rules.
- Create entities, migrations, and idempotent seeds only when the active story requires them; do not model future stories in advance.
- Keep seed files owned and named by story so they can run independently and in deterministic order.
- Create types, interfaces, DTOs, schemas, events, adapters, and shared contracts only when the active story has a concrete consumer for them.
- Keep implementation details local to the owning module. Move a definition to `packages/contracts` only when it crosses an actual application or package boundary.
- Do not create placeholder domain contracts for future stories or use the shared package as a general-purpose model library.
- Update documentation and `.env.example` when adding configuration.

## Required handoff

When finished, report: changed files, decisions made, commands run, test results, remaining risks, and verified acceptance criteria.

## GitHub and pull request workflow

- Target pull requests to `main` unless the user explicitly requests another base branch.
- Prefer the local `gh` CLI for pull request creation after pushing the branch, even when `gh auth status` reports a stale or invalid status. In this repository, `gh pr create` may still succeed because git and the CLI can use different stored credentials.
- Do not stop at `gh auth status` alone. Treat it as a signal, then attempt the intended non-destructive `gh` command once when the branch has already been pushed and the user asked for a PR.
- If `gh pr create` fails with an authentication error, ask the user to re-authenticate with `gh auth login` and retry after they confirm.
- The GitHub connector may not have permission to create pull requests for this private repository. If it returns `Resource not accessible by integration`, fall back to `gh pr create`.
- Never print tokens or credential details. It is safe to report whether authentication worked or failed.

## Global Definition of Done

- The story's acceptance criteria are met.
- TypeScript compiles without errors.
- Relevant lint checks and tests pass.
- External errors have timeouts, handling, and safe logs.
- New endpoints include authorization, validation, and documented request/response behavior when applicable.
- Repeatable operations are idempotent when applicable.

## API module organization

- Keep NestJS modules organized by responsibility instead of placing every file at the module root.
- Use folder names such as `controllers`, `guards`, `decorators`, `providers`, `requests`, `types`, `entities`, `mappers`, and `services` when the module owns those concepts.
- Each responsibility folder must expose its public production files through an `index.ts` barrel. Import from the folder barrel, for example `import { AuthController } from './controllers';`.
- Do not export test files from barrels.
- Keep module internals local until another application or package has a concrete need for a shared contract.
- API persistence entities that need the standard `id`, `createdAt`, `updatedAt`, and `deletedAt` columns should extend `AppBaseEntity` from `apps/api/src/database/entities`.

## Mobile testing boundaries

- Keep Expo Router navigation smoke tests shallow. Route smoke tests should prove that route modules render the expected route-level text and placeholders, not re-test every reusable UI component below them.
- In `apps/mobile/test/navigation.smoke.test.tsx`, mock shared design-system components such as `AppScreen`, `AppButton`, `PlaceholderCard`, `EmptyState`, and `LoadingState`. Their real behavior belongs in focused component unit tests under `apps/mobile/components`.
- When a route has enough unique content or behavior to deserve direct coverage, add a dedicated screen test such as `apps/mobile/test/welcome-screen.test.tsx` and mock unrelated child components there.
- Avoid rendering a full route plus all shared UI children in a smoke test. Under `jest --coverage --runInBand`, that can turn a route smoke test into a slow integration test and cause per-test timeout flakes.
- Do not increase Jest timeouts to hide these failures. Prefer smaller test boundaries, focused mocks, and separate component tests.
