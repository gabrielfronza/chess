# STORY-005 — Profile and onboarding

**Status:** done  
**Dependencies:** STORY-004

## Story

As a new user, I want to complete my required information before participating in tournaments.

## Scope

- Form for display name, country, and date of birth.
- `GET/PATCH /me` API and validation for onboarding profile completion.
- Onboarding state and mandatory redirection after login: incomplete authenticated users go to `/onboarding`; completed authenticated users go to `/home`; unauthenticated users go to `/welcome`.
- Keep the Auth0 email read-only and outside onboarding edits.
- Terms content, acceptance history, and re-acceptance flows are out of scope and deferred to STORY-020.

## Acceptance criteria

- Fields and the configured age-of-majority/age policy are validated on the server.
- Story 5 does not record terms acceptance; that belongs to STORY-020.
- An incomplete user cannot access registration or the wallet.
- Reopening the app resumes at the correct step.
- Country is required during onboarding and is persisted on the user profile.
- Display name is collected and owned by onboarding, not by the initial Auth0 account synchronization.

## Verification

Run validation and authorization tests and the complete mobile flow.

Validated during implementation:

- `npx nx run api:test --skip-nx-cache`
- `npx nx run api:lint --skip-nx-cache`
- `npx nx run api:build --skip-nx-cache`
- `npx nx run mobile:test --skip-nx-cache`
- `npx nx run mobile:lint --skip-nx-cache`
- `npx nx run mobile:build --skip-nx-cache`
- `npm run format:check`
