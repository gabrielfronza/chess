# MVP Implementation Plan

## Strategy

Stories are ordered by dependency and product risk. We first create infrastructure and identity, then prove a stable free-tournament journey, and only then introduce deposits, entry-fee billing, and withdrawals. Each file in `docs/stories` is a unit that can be delivered and reviewed independently.

## Wave 0 — Foundation

1. `STORY-001` — Quality, configuration, and contracts.
2. `STORY-002` — PostgreSQL, TypeORM, migrations, and initial model.
3. `STORY-003` — Application shell and navigation.
4. `STORY-018` — Public landing page on Expo Web.

Stories 002 and 003 can run in parallel after 001. Story 018 can start as soon as 003 is complete.

## Wave 1 — Identity

5. `STORY-004` — Auth0 in the API and app.
6. `STORY-005` — Profile and onboarding.
7. `STORY-006` — Lichess OAuth linking.

## Wave 2 — Tournament catalog

8. `STORY-007` — Tournament administration.
9. `STORY-008` — Marketplace and details.

## Wave 3 — Stable free-tournament journey

10. `STORY-011` — Free tournament registration.
11. `STORY-012` — Authenticated home without wallet coupling.
12. `STORY-013` — Result synchronization and prize entitlements.
13. `STORY-014` — Tournament history.

Stories 012 and 013 can run in parallel after 011 where their touched modules do not overlap. Story 014 follows 013.

## Wave 4 — Core operational readiness

14. `STORY-016` — Observability, security, and auditing for the core journey.
15. `STORY-017` — End-to-end tests and release preparation for free tournaments.

The core journey must be stable in staging before financial capabilities begin.

## Wave 5 — Financial capabilities

16. `STORY-009` — Wallet and ledger.
17. `STORY-010` — Purchasing credits with Stripe.
18. `STORY-015` — Withdrawal request (without automatic payout).
19. `STORY-019` — Paid registration, prize credits, financial observability, and controlled rollout.

Stories 010 and 015 can run in parallel after 009. Paid registration remains last and depends on the stable core journey plus the financial foundation.

## Verifiable milestones

- M1 (Stories 001–006 and 018): a visitor accesses the landing page; a user signs in, completes onboarding, and links Lichess.
- M2 (Stories 007–008): an administrator publishes a tournament and a user explores the catalog.
- M3 (Stories 011–014): a user joins a free tournament and sees synchronized results and history.
- M4 (Stories 016–017): the non-financial critical flow is observable, tested, and operable in staging.
- M5 (Stories 009–010 and 015): wallet, deposits, and withdrawal requests are independently verified.
- M6 (Story 019): paid registration and prize credits are enabled through a controlled rollout after financial E2E and reconciliation pass.

## Recommended agent order

Give the agent the exact story path. It must start by confirming dependencies, finish by running the “Verification” section, and not start the next story automatically.
