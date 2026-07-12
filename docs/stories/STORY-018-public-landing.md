# STORY-018 — Public landing page

**Status:** ready  
**Dependencies:** STORY-003

## Story

As a visitor, I want to understand the value proposition and see evidence of activity before creating an account.

## Scope

- Responsive public route in Expo Web with Hero, How It Works, upcoming tournaments, recent winners, and FAQ sections.
- Login and Sign Up CTAs direct to Auth0 when STORY-004 is available; before then, they may use an explicit adapter/placeholder.
- Public endpoints return only published tournaments and winners from completed tournaments, without extra personal data.
- Metadata, accessibility, performance, and basic consent-based analytics.

## Acceptance criteria

- Primary content works on desktop and mobile web.
- No private functionality is accessible without authentication.
- Empty states do not break the page or invent results.
- Staging Lighthouse reports no critical accessibility or security issue.

## Verification

Run the web export, public-query tests, and a Lighthouse audit.
