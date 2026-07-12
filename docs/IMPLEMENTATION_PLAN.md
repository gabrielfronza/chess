# MVP Implementation Plan

## Strategy

Stories are ordered by dependency and risk. We first create a thin infrastructure and identity vertical; then tournaments and money; finally integrations, operations, and quality. Each file in `docs/stories` is a unit that can be delivered and reviewed independently.

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

## Wave 2 — Catalog and operations

8. `STORY-007` — Tournament administration.
9. `STORY-008` — Marketplace and details.
10. `STORY-009` — Wallet and ledger.

Stories 008 and 009 can run in parallel once their prerequisites are ready.

## Wave 3 — Revenue and registration

11. `STORY-010` — Purchasing credits with Stripe.
12. `STORY-011` — Transactional tournament registration.
13. `STORY-012` — Authenticated home.

## Wave 4 — Closing the loop

14. `STORY-013` — Result synchronization and prizes.
15. `STORY-014` — Tournament history.
16. `STORY-015` — Withdrawal request (without automatic payout).

## Wave 5 — MVP readiness

17. `STORY-016` — Observability, security, and auditing.
18. `STORY-017` — End-to-end tests and release preparation.

## Verifiable milestones

- M1 (Stories 001–006 and 018): a visitor accesses the landing page; a user signs in, completes onboarding, and links Lichess.
- M2 (Stories 007–009): an administrator publishes a tournament and a user checks the catalog and balance.
- M3 (Stories 010–012): a user purchases credits and registers with failure compensation.
- M4 (Stories 013–015): results, prizes, history, and withdrawal requests complete the journey.
- M5 (Stories 016–017): the critical flow is tested and operable in staging.

## Recommended agent order

Give the agent the exact story path. It must start by confirming dependencies, finish by running the “Verification” section, and not start the next story automatically.
