# STORY-017 — E2E tests and release preparation

**Status:** ready  
**Dependencies:** STORY-012, STORY-014, STORY-016

## Story

As a team, we want to prove the critical flow in staging and have a repeatable release.

## Scope

- E2E journey: login → onboarding → Lichess → free tournament registration → result → history.
- Priority failure scenarios: unavailable Lichess, repeated registration, and interrupted result synchronization.
- Staging builds, migrations, safe seed, backup/restore, and a release/rollback checklist.
- Document sandbox accounts and separate secrets by environment.

## Acceptance criteria

- The happy path passes in CI/staging with controlled sandbox or simulated integrations.
- Tests prove idempotency for registration, result synchronization, and reconciliation.
- Deployment and rollback are documented and rehearsed.
- No critical/high blocker remains without explicit acceptance.

## Verification

Run the complete pipeline, staging E2E, and a rollback exercise.
