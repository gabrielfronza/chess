# STORY-001 — Quality, configuration, and contracts

**Status:** done
**Dependencies:** none

## Story

As a team, we want a reproducible foundation for developing the mobile app and API with fast feedback.

## Scope

- Standardize Node 22, scripts, linting, formatting, and unit tests.
- Initialize Nx at the repository root and register the API, mobile app, and shared contracts as Nx projects.
- Provide canonical Nx targets for serve, build, lint, unit tests, E2E tests, and affected-only CI execution.
- Configure a pre-commit hook to run lint with automatic fixes and update staged files.
- Configure variables validated at API startup.
- Create an empty shared-contracts package boundary and its build/test tooling without speculative domain types.
- Add shared contracts only in the later story that introduces the first concrete cross-application consumer.
- Add the `GET /api/v1/health` endpoint.
- Add required pull-request CI with lint, build, and unit tests.
- Configure Playwright and an E2E pipeline that can only be started manually.

## Acceptance criteria

- A clean setup works by following the README.
- `nx graph` discovers both applications and the shared package without circular dependencies.
- Root development and verification commands run through Nx rather than `npm --prefix` orchestration.
- The contracts package exposes no placeholder User, Tournament, Wallet, Payment, or other future domain definitions.
- Invalid configuration prevents the API from starting and produces a safe message.
- The health check returns the version and status without exposing secrets.
- Every commit runs lint with automatic fixes before it is created.
- The pull-request pipeline runs lint without changing files, unit tests, and builds for both apps.
- API and mobile unit-test coverage is measured by CI and cannot fall below 90% for statements, functions, or lines. Branch coverage is reported for review; NestJS's generated decorator helpers are not treated as application branches.
- The `quality-gate` check can be configured as required in the `main` branch protection rule.
- The E2E pipeline can be started manually in GitHub Actions and publishes the Playwright report.
- At least one Playwright test validates the running API. Browser journeys through Expo Web and the API are owned by STORY-017, after the relevant user flows exist.

## Verification

`npx nx show projects`, `npx nx run-many -t lint test build`, and the Playwright E2E target. Verify the CI workflow uses `nx affected` with the pull request base and head revisions.

In GitHub, manually run the E2E workflow and protect the `main` branch by requiring the `quality-gate` check to pass before merging.
