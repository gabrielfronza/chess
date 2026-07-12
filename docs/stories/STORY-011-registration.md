# STORY-011 — Transactional registration

**Status:** ready  
**Dependencies:** STORY-006, STORY-007, STORY-009

## Story

As an eligible user, I want to enter a tournament and have my spot and fee handled atomically.

## Scope

- Validate onboarding, Lichess, status/deadline, duplicates, and balance.
- Reserve the fee, register in Lichess Swiss, confirm registration, and capture/deduct the reservation.
- On failure, release the reservation; a job reconciles intermediate states after a crash.
- UI with confirmation, progress, success, and recoverable error states.

## Acceptance criteria

- A double click or concurrent request creates one registration and one charge.
- A known Lichess failure releases the funds.
- A timeout leaves a reconcilable state without incorrectly assuming failure or success.
- A confirmed registration contains wallet and Lichess references.

## Verification

Run integration tests for success, insufficient balance, duplicates, timeout, and compensation.
