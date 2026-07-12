# STORY-002 — PostgreSQL, TypeORM, and initial model

**Status:** ready  
**Dependencies:** STORY-001

## Story

As a team, we want transactional persistence and a versioned schema to support the domain.

## Scope

- Docker Compose with PostgreSQL and TypeORM.
- Configure a `DataSource` shared by the application and TypeORM CLI.
- Version migrations for every schema change; keep `synchronize: false` in application environments.
- Add an Nx `api:db-migrate` target and make local `api:serve` depend on it.
- Keep production migrations as an explicit CI/CD release step, never an application-start side effect.
- Model User, LichessAccount, Tournament, Registration, Wallet, WalletEntry, Payment, Result, WithdrawalRequest, and AuditLog.
- Use explicit status enums, UTC timestamps, unique constraints, and money stored in cents.
- Seed only an administrator and non-financial sample tournaments.

## Acceptance criteria

- Migrations create the database from scratch and can be applied through the CLI in CI.
- The application does not depend on automatic schema synchronization.
- Starting the API locally applies pending migrations before NestJS starts.
- Starting the production API does not attempt to acquire migration locks or modify the schema.
- Constraints prevent duplicate Lichess links, registrations, and idempotency keys.
- Relations and indexes cover the queries described in the MVP.
- An integration test writes and reads the primary aggregate.

## Verification

Start the database, run migrations through the TypeORM CLI, run the seed, and run integration tests.
