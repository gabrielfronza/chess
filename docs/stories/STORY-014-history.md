# STORY-014 — Tournament history

**Status:** ready  
**Dependencies:** STORY-003, STORY-013

## Story

As a user, I want to review my past tournaments, placement, and prize.

## Scope

- Paginated endpoint for the user's history.
- Screen with name, date, fee, participants, placement, and prize.
- Details open the corresponding result/tournament.

## Acceptance criteria

- A user sees only their own history.
- The default order is newest first and pagination is stable.
- No prize is distinguished from pending synchronization.
- Values and placement come from the final snapshot.

## Verification

Run authorization, pagination, and visual-state tests.
