# STORY-001 — Quality, configuration, and contracts

**Status:** ready  
**Dependencies:** none

## Story

As a team, we want a reproducible foundation for developing the mobile app and API with fast feedback.

## Scope

- Standardize Node 22, scripts, linting, formatting, and unit tests.
- Configure a pre-commit hook to run lint with automatic fixes and update staged files.
- Configure variables validated at API startup.
- Create a shared contracts package without domain logic.
- Add OpenAPI and the `GET /api/v1/health` endpoint.
- Add required pull-request CI with lint, build, and unit tests.
- Configure Playwright and an E2E pipeline that can only be started manually.

## Acceptance criteria

- A clean setup works by following the README.
- Invalid configuration prevents the API from starting and produces a safe message.
- The health check returns the version and status without exposing secrets.
- Every commit runs lint with automatic fixes before it is created.
- The pull-request pipeline runs lint without changing files, unit tests, and builds for both apps.
- The `quality-gate` check can be configured as required in the `main` branch protection rule.
- The E2E pipeline can be started manually in GitHub Actions and publishes the Playwright report.
- At least one Playwright E2E test validates the running application.

## Verification

`npm run lint`, `npm run test:unit`, `npm run build`, and `npm run test:e2e`.

In GitHub, manually run the E2E workflow and protect the `main` branch by requiring the `quality-gate` check to pass before merging.
