# STORY-008 — Marketplace and details

**Status:** done  
**Dependencies:** STORY-003, STORY-007

## Story

As a user, I want to discover tournaments and review every condition before joining.

## Scope

- Paginated endpoints for published tournaments and tournament details.
- Mobile list with name, date, time control, rounds, fee, prize, participants, and status.
- Detail screen with schedule, duration, rules, participants, and a contextual CTA.
- Empty, loading, error, and manual refresh states.

## Acceptance criteria

- Drafts do not appear to regular users.
- Dates use the device timezone and monetary values are formatted as USD.
- Pagination does not duplicate items.
- The CTA explains why registration is unavailable.

## Verification

Completed with API query, visibility, pagination, validation, controller, and
mapper tests; mobile API client, formatting, navigation, list, detail,
pagination de-duplication, and loading/empty/error/retry state tests.

Validated with:

- `npm run test:unit`
- `npm run lint`
- `npm run build`
- `git diff --check`
