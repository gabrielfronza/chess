# STORY-013 — Results and prize distribution

**Status:** ready  
**Dependencies:** STORY-011

## Story

As a participant, I want the final Lichess result synchronized and prizes credited correctly.

## Scope

- Administrative and job-based synchronization of final standings.
- Immutable snapshot of placement, score, and tie-breaks.
- Explicit prize-breakdown policy and ledger credits.
- Reconciliation, retries, and auditing.

## Acceptance criteria

- Only a tournament completed in Lichess can distribute prizes.
- The sum of prizes does not exceed the configured pool.
- Reprocessing standings does not duplicate results or credits.
- Discrepancies after distribution require an audited administrative flow.

## Verification

Use standings fixtures to test ties, winners, repetition, incomplete data, and partial failure.
