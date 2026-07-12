# STORY-009 — Wallet and ledger

**Status:** ready  
**Dependencies:** STORY-002, STORY-004, STORY-017

## Story

As a user, I want to see my balance and transactions with traceability.

## Scope

- Immutable ledger with CREDIT, DEBIT, RESERVE, RELEASE, and ADJUSTMENT.
- Transactional service for available and reserved balances.
- Balance and paginated history endpoints with the corresponding mobile screen.
- Administrative adjustments require a reason, actor, and idempotency key.

## Acceptance criteria

- No monetary value uses floating point.
- Concurrency cannot produce a negative available balance.
- An idempotency key cannot create two transactions.
- History displays amount, type, date, status, and reference.

## Verification

Run concurrent reservation, idempotency, and ledger reconciliation tests.
