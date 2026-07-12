# MVP Architecture

## Key decisions

- Modular NestJS monolith for the backend. This is the simplest option for preserving registration and wallet transactions in the MVP.
- Nx orchestrates the monorepo so applications and shared packages use one project graph, consistent targets, and affected-only CI execution.
- PostgreSQL as the source of truth; TypeORM will be introduced in the foundation, with schema evolution handled exclusively through versioned migrations and `synchronize: false` outside tests.
- Monetary values stored in USD cents, never as floating-point values.
- Immutable wallet ledger. Balances are derived or updated only within database transactions.
- Auth0 issues identities; the API maintains profiles, roles, and account states.
- Lichess OAuth PKCE links accounts without manual username entry.
- Stripe Checkout/Payment Intent adds credits; signed webhooks confirm credits idempotently.
- Asynchronous jobs handle result synchronization and integration retries.

## Monorepo startup and migrations

- Root commands are Nx targets. `nx serve api` and `nx serve mobile` are the canonical development entry points; a root `dev` target may run both in parallel.
- The local API serve target depends on `api:db-migrate`, so a developer starts against the latest schema.
- Tests that require PostgreSQL depend on an isolated test-database migration target.
- Production application startup never runs migrations. CI/CD runs `api:db-migrate` once as an explicit release step before deploying the new application version.
- Migrations must be backward-compatible with the currently deployed application so rolling deployments and rollback remain safe.

## API modules

`auth`, `users`, `lichess`, `tournaments`, `registrations`, `wallet`, `payments`, `results`, `admin`, and `jobs`.

## Critical invariants

1. A platform user links to at most one Lichess account, and vice versa.
2. A confirmed paid registration corresponds to exactly one entry-fee reservation or charge; a free registration creates neither.
3. A Lichess failure after a paid reservation releases the funds idempotently.
4. A repeated Stripe event or Lichess synchronization does not duplicate credits, registrations, or prizes.
5. Administrative adjustments and financial changes always create an audit trail.

## Outside the MVP

Subscriptions, rating restrictions, automatic tournament creation, the final withdrawal provider/processing flow, microservices, and chat.

Note: the landing page will be delivered through the responsive Expo web output in STORY-018. If SEO and marketing become critical, it should later move to a dedicated web application.
