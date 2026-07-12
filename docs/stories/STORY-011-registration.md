# STORY-011 — Free tournament registration

**Status:** ready  
**Dependencies:** STORY-006, STORY-007

## Story

As an eligible user, I want to enter a free tournament reliably before paid entry is enabled.

## Scope

- Validate onboarding, Lichess, tournament status/deadline, and duplicates.
- Register in Lichess Swiss and confirm the local registration idempotently.
- Reconcile intermediate states after timeouts or crashes.
- UI with confirmation, progress, success, and recoverable error states.
- Reject tournaments with a non-zero entry fee until STORY-019 enables paid registration.

## Acceptance criteria

- A double click or concurrent request creates one registration.
- A known Lichess failure leaves no confirmed local registration.
- A timeout leaves a reconcilable state without incorrectly assuming failure or success.
- A confirmed registration contains its Lichess reference.
- Paid tournaments cannot be joined through the free-registration path.

## Verification

Run integration tests for success, duplicates, timeout, reconciliation, and rejection of paid tournaments.
