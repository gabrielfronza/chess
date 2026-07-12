# STORY-006 — Lichess OAuth linking

**Status:** ready  
**Dependencies:** STORY-005

## Story

As a user, I want to connect my Lichess account without typing a username so I can play.

## Scope

- OAuth Authorization Code with PKCE, state, and a secure callback.
- Fetch the authenticated Lichess identity and persist encrypted tokens.
- Enforce a one-to-one relationship at the database and service levels.
- Display the linked account and allow revocation only when it does not break an active registration.

## Acceptance criteria

- An invalid or expired state is rejected.
- The same Lichess account cannot be linked to two users, even under concurrency.
- A username is never accepted as proof of identity.
- External failures have a timeout and a recoverable message.

## Verification

Test against a simulated Lichess server for success, duplicates, invalid state, and timeout.
