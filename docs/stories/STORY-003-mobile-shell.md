# STORY-003 — Mobile shell and navigation

**Status:** done
**Dependencies:** STORY-001

## Story

As a user, I want a consistent and accessible navigation structure in the application.

## Scope

- Configure Expo Router, theme, safe areas, loading, and an error boundary.
- Create public routes, onboarding, and authenticated tabs: Home, Tournaments, Wallet, History, and Profile.
- Create a typed HTTP client and per-environment configuration.
- Screens are placeholders; business logic is outside this story.

## Acceptance criteria

- Public and private routes have distinct groups.
- A deep link can open a tournament detail route.
- Base components respect accessibility and loading, error, and empty states.
- The app starts on iOS, Android, or Expo Web without TypeScript errors.

## Verification

Run type checking and a navigation smoke test.

The navigation smoke test is intentionally shallow: it mocks reusable mobile UI primitives and verifies route-level rendering only. Reusable components such as `AppScreen`, `AppButton`, placeholder cards, and screen states are covered by their own focused unit tests so route smoke tests stay fast under coverage.
