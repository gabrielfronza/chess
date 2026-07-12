# STORY-015 — Withdrawal request

**Status:** ready  
**Dependencies:** STORY-009

## Story

As a user, I want to request a withdrawal so the team can process it manually while the provider is undecided.

## Scope

- Create a request and reserve the amount in the ledger.
- REQUESTED, APPROVED, REJECTED, PAID, and CANCELLED states.
- Administration through the API, with a reason and audit trail.
- Do not integrate payouts or collect bank details at this stage.

## Acceptance criteria

- A request cannot exceed the available balance or be duplicated by idempotency key.
- Rejection/cancellation releases the reservation exactly once.
- Marking a request PAID requires administrative confirmation and an external reference.
- The UI makes it clear that processing is manual and promises no deadline.

## Verification

Test the state machine, reservations, and administrative authorization.
