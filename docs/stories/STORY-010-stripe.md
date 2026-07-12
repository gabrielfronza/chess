# STORY-010 — Purchasing credits with Stripe

**Status:** ready  
**Dependencies:** STORY-009

## Story

As a user, I want to add USD credits to my wallet through Stripe.

## Scope

- Create a payment session/intent for permitted amounts.
- Use a signed webhook as the authority for confirming the credit.
- Persist payment state, event ID, and idempotency.
- The mobile screen starts checkout and tracks the result.

## Acceptance criteria

- The client return alone never credits the balance.
- A repeated webhook credits the balance exactly once.
- An invalid signature is rejected and failures are retryable.
- The event amount and currency must match the created payment.

## Verification

Use the Stripe CLI to test success, repetition, failure, and invalid-signature scenarios.
