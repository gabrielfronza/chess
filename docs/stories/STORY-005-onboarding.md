# STORY-005 — Profile and onboarding

**Status:** ready  
**Dependencies:** STORY-004

## Story

As a new user, I want to complete my required information before participating in tournaments.

## Scope

- Form for name, email, country, date of birth, and terms acceptance.
- `GET/PATCH /me` API, validation, and recording of the terms version and acceptance date.
- Onboarding state and mandatory redirection after login: incomplete users go to `/onboarding`; users who completed onboarding go to `/welcome`.
- Display and handle the Auth0 email according to the defined policy.

## Acceptance criteria

- Fields and the configured age-of-majority/age policy are validated on the server.
- Acceptance stores a version and timestamp, not just a boolean.
- An incomplete user cannot access registration or the wallet.
- Reopening the app resumes at the correct step.
- Country is required during onboarding and is persisted on the user profile.
- Display name is collected and owned by onboarding, not by the initial Auth0 account synchronization.

## Verification

Run validation and authorization tests and the complete mobile flow.
