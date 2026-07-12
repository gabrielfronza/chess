# STORY-019 — Paid tournament registration rollout

**Status:** ready  
**Dependencies:** STORY-009, STORY-010, STORY-011, STORY-013, STORY-016, STORY-017

## Story

As an eligible user, I want to pay an entry fee to join a tournament after the core tournament experience is stable.

## Scope

- Enable non-zero tournament entry fees behind an operational feature flag.
- Validate onboarding, Lichess, tournament state/deadline, duplicates, and available balance.
- Reserve the fee, register in Lichess Swiss, confirm registration, and capture the reservation.
- Release funds idempotently on a known Lichess failure and reconcile ambiguous timeouts.
- Credit previously calculated prize entitlements to the wallet exactly once.
- Add financial metrics, alerts, audit events, runbooks, and paid-flow E2E coverage before rollout.

## Acceptance criteria

- A double click or concurrent request creates one registration and one charge.
- A known Lichess failure releases reserved funds exactly once.
- A timeout leaves a reconcilable state without incorrectly assuming failure or success.
- Reprocessing results does not duplicate prize credits.
- Paid registration remains disabled until financial reconciliation and rollback checks pass in staging.

## Verification

Run integration and E2E tests for success, insufficient balance, duplicates, timeout, compensation, prize crediting, feature-flag rollback, and reconciliation.
