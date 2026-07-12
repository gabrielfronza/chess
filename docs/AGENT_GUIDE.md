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

## Global Definition of Done

- The story's acceptance criteria are met.
- TypeScript compiles without errors.
- Relevant lint checks and tests pass.
- External errors have timeouts, handling, and safe logs.
- New endpoints include authorization, validation, and documented request/response behavior when applicable.
- Repeatable operations are idempotent when applicable.

## Mobile testing boundaries

- Keep Expo Router navigation smoke tests shallow. Route smoke tests should prove that route modules render the expected route-level text and placeholders, not re-test every reusable UI component below them.
- In `apps/mobile/test/navigation.smoke.test.tsx`, mock shared design-system components such as `AppScreen`, `AppButton`, `PlaceholderCard`, `EmptyState`, and `LoadingState`. Their real behavior belongs in focused component unit tests under `apps/mobile/components`.
- When a route has enough unique content or behavior to deserve direct coverage, add a dedicated screen test such as `apps/mobile/test/welcome-screen.test.tsx` and mock unrelated child components there.
- Avoid rendering a full route plus all shared UI children in a smoke test. Under `jest --coverage --runInBand`, that can turn a route smoke test into a slow integration test and cause per-test timeout flakes.
- Do not increase Jest timeouts to hide these failures. Prefer smaller test boundaries, focused mocks, and separate component tests.
