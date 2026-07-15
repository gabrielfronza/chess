# STORY-024 — Mobile UI copy and header cleanup

**Status:** done  
**Dependencies:** STORY-003, STORY-004, STORY-005

## Story

As a mobile user, I want the app to use product-level authentication language and avoid duplicate navigation headers so the interface feels polished and provider-agnostic.

## Scope

- Remove user-facing Auth0 wording from the mobile frontend.
- Keep provider-specific Auth0 implementation details inside code/configuration where they are still technically accurate.
- Hide native top navigation headers across public, authenticated, and nested tournament routes.
- Preserve bottom tab labels and in-page content sections.
- Ensure the tournaments tab does not show duplicate `Tournaments` headers above the screen content.

## Out of scope

- Renaming Auth0-specific classes, environment variables, or backend documentation.
- Changing authentication provider behavior.
- Redesigning the page content, bottom tabs, or onboarding flow.

## Acceptance criteria

- Login UI says `Sign in` or generic authentication copy, not `Auth0`.
- Onboarding/profile copy does not expose the Auth0 provider name.
- Public stack, authenticated tabs, and tournament nested stack do not render native top headers.
- The tournaments tab shows only the intended in-page content, not duplicate route headers.
- Mobile tests are updated for the new user-facing copy.

## Verification

Run mobile unit tests, mobile lint, and a manual web/mobile smoke check for `/welcome`, `/login`, `/home`, `/tournaments`, `/wallet`, `/history`, `/profile`, and `/onboarding`.
