# STORY-025 — Authenticated API client and token propagation

**Status:** ready  
**Dependencies:** STORY-004, STORY-005, STORY-006, STORY-008

## Story

As a mobile developer, I want authentication to be applied at the HTTP boundary
so feature screens and domain API methods do not pass access tokens through every
function call.

## Problem

The current mobile API interfaces accept `accessToken` in profile, Lichess, and
tournament methods. Screens read the current session and repeatedly forward the
same token through feature helpers until it reaches `createBearerHeaders`. This
adds authentication plumbing to domain APIs and makes new authenticated calls
easy to implement inconsistently.

Reading `localStorage` directly from domain API modules is not an acceptable
replacement. The application must support both Expo native secure storage and
web storage, preserve testability, handle expiration centrally, and avoid making
tokens globally accessible outside the authentication boundary.

## Scope

- Introduce a single session/access-token provider that keeps the active session
  in memory after startup and persists it through the existing platform storage
  adapter.
- Introduce an authenticated HTTP client that requests the current valid token
  from that provider and adds the `Authorization: Bearer` header at request time.
- Keep the token provider and HTTP client injectable so unit tests can supply
  isolated fakes without touching platform storage.
- Remove `accessToken` parameters from profile, Lichess, tournament, OAuth-linking,
  and other authenticated domain API methods.
- Keep a separate unauthenticated request path for health, public content, login,
  and any future endpoint that does not require a session.
- Define centralized behavior for startup hydration, expiration, logout, missing
  sessions, and `401` responses.
- If token refresh is supported, serialize concurrent refresh attempts and retry
  each request at most once. Otherwise, clear the expired/invalid session and
  redirect through the existing authentication flow.
- Clear the in-memory token immediately on logout or account/session replacement.
- Update tests and developer documentation for the new authenticated request
  boundary.

## Out of scope

- Moving native tokens from secure storage into browser-style `localStorage`.
- Allowing domain services or screens to import platform storage directly.
- Changing backend JWT validation, Auth0 claims, roles, or API authorization
  rules.
- Persisting access tokens in a new database or custom backend cache.
- Adding background refresh unless it is required for the agreed session model.

## Acceptance criteria

- Authenticated domain API methods no longer accept an access-token argument.
- Screens and feature helpers do not construct authorization headers.
- Exactly one mobile infrastructure boundary is responsible for adding bearer
  tokens to authenticated HTTP requests.
- The active session is hydrated from the platform storage adapter once and then
  served from memory without reading persistent storage for every request.
- Native builds continue using secure storage; web storage remains encapsulated
  behind the existing adapter.
- Missing or expired sessions fail before making an authenticated network request
  and trigger the established sign-in flow.
- A backend `401` cannot cause an infinite retry or refresh loop.
- Concurrent authenticated requests do not start duplicate session hydration or
  token-refresh operations.
- Logout clears both memory and persisted session state before another request can
  reuse the token.
- Tokens are never included in logs, error messages, analytics, or test snapshots.
- Profile, Lichess linking/revocation, tournament marketplace, and route-guard
  behavior remain functionally unchanged.

## Verification

- Unit-test token injection, one-time hydration, memory caching, expiration,
  logout, missing-session rejection, `401` handling, and concurrent requests.
- Update domain API tests to assert paths and bodies without token parameters or
  repeated authorization-header setup.
- Run mobile authentication, profile, Lichess, tournament, and navigation tests.
- Run `npm run test:unit`, `npm run lint`, and `npm run build`.
