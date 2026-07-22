# STORY-007 — Tournament administration

**Status:** done  
**Dependencies:** STORY-002, STORY-004

## Story

As an administrator, I want to create, edit, publish, and cancel manually managed tournaments.

## Scope

- Administrative CRUD with name, description, schedule, duration, time control, rounds, fee, prize pool, rules, and Lichess tournament ID.
- State machine with DRAFT, PUBLISHED, REGISTRATION_CLOSED, RUNNING, FINISHED, and CANCELLED.
- Participant list and audit trail.
- In this story, the administrative interface may be API-only.

## Acceptance criteria

- Only ADMIN can use write endpoints.
- Invalid transitions and financial edits after registrations are blocked.
- A published tournament requires all fields and a valid Lichess link.
- Cancellation records a reason and prepares an idempotent refund when necessary.

## Verification

Test the state machine, RBAC, and validations.
