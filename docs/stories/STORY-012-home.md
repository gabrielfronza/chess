# STORY-012 — Authenticated home

**Status:** ready  
**Dependencies:** STORY-008, STORY-009, STORY-011

## Story

As a user, I want an actionable summary of my activity when I open the app.

## Scope

- Aggregation endpoint or coordinated queries for upcoming tournaments, balance, registrations, and recent results.
- Cards and shortcuts to the marketplace, wallet, history, and profile.
- Cache and refresh without showing another user's data.

## Acceptance criteria

- Each section handles empty and error states independently.
- Pull-to-refresh updates the data.
- A registered tournament can open its details and, when applicable, Lichess.
- Balances and dates use formatting consistent with the rest of the app.

## Verification

Test the aggregator and run a smoke test for the shortcuts.
