# STORY-013 — Results and prize entitlements

**Status:** ready  
**Dependencies:** STORY-011

## Story

As a participant, I want the final Lichess result synchronized and any future prize entitlement calculated correctly.

## Scope

- Administrative and job-based synchronization of final standings.
- Immutable snapshot of placement, score, and tie-breaks.
- Immutable prize-entitlement calculation; ledger credits are enabled later by STORY-019.
- Reconciliation, retries, and auditing.

## Acceptance criteria

- Only a tournament completed in Lichess can calculate final prize entitlements.
- The sum of prizes does not exceed the configured pool.
- Reprocessing standings does not duplicate results or prize entitlements.
- Discrepancies after finalization require an audited administrative flow.

## Verification

Use standings fixtures to test ties, winners, repetition, incomplete data, and partial failure.
