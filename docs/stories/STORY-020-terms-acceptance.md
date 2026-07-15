# STORY-020 — Terms acceptance

**Status:** ready  
**Dependencies:** STORY-005

## Story

As a user, I want to review and accept the active terms before using protected product features.

## Scope

- Versioned terms records managed independently from the onboarding profile.
- Acceptance history linked to the authenticated user.
- API support for reading the active terms version and recording acceptance.
- Mobile UI for presenting the active terms and collecting explicit acceptance.
- Re-acceptance flow when a new required terms version becomes active.

## Acceptance criteria

- Terms content/version is not hard-coded into the user profile.
- A user can have an immutable history of accepted terms versions.
- The app can identify whether the user has accepted the currently required version.
- Users who have not accepted the required version are blocked from protected flows that require terms acceptance.
- Acceptance stores the terms version, timestamp, user id, and enough metadata for auditability.
- Publishing a new required version causes previously onboarded users to accept again before continuing.

## Verification

Run API tests for active terms, acceptance history, duplicate acceptance idempotency, and required-version checks. Run mobile tests for first acceptance and re-acceptance flows.
