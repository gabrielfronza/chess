# STORY-004 — Authentication with Auth0

**Status:** in progress  
**Dependencies:** STORY-002, STORY-003

## Story

As a visitor, I want to create an account and sign in securely to access the platform.

## Scope

- Auth0 Universal Login in the app with PKCE and secure session storage.
- JWT/JWKS guard in the API, audience/issuer validation, and idempotent user synchronization.
- Logout and expired-token handling.
- `USER` and `ADMIN` roles maintained by the API; do not trust roles sent by the client.

## Acceptance criteria

- A private endpoint rejects a missing or invalid token and accepts a valid token.
- The first login creates the user exactly once; subsequent logins update only permitted fields.
- Logout removes local credentials.
- No token appears in logs or insecure storage.

## Verification

Run guard unit tests, synchronization integration tests, and a login smoke test.
