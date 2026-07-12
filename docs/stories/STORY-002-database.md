# STORY-002 — PostgreSQL and TypeORM foundation

**Status:** done
**Dependencies:** STORY-001

## Story

As a team, we want an isolated local database and a versioned persistence foundation that domain stories can extend incrementally.

## Scope

- Docker Compose with PostgreSQL and TypeORM.
- Use the Compose project name `chess_app`, database name `chess_app_dev`, and a configurable project-specific host port; do not set a fixed `container_name`.
- Provide a separate `chess_app_test` database for integration tests.
- Configure a `DataSource` shared by the application and TypeORM CLI.
- Version migrations for every schema change; keep `synchronize: false` in application environments.
- Add an Nx `api:db-migrate` target and make local `api:serve` depend on it.
- Keep production migrations as an explicit CI/CD release step, never an application-start side effect.
- Establish migration, rollback, and seed runners without creating the complete domain model.
- Add only the minimum migration needed to verify database connectivity and the migration lifecycle.
- Require each later story to introduce only the entities, constraints, indexes, migrations, and idempotent seed data needed by that story.
- Keep seeds split by owning story instead of maintaining one global domain seed.

## Planned persistence ownership

| Story | Models introduced when required |
|---|---|
| STORY-004 | User |
| STORY-006 | LichessAccount |
| STORY-007 | Tournament |
| STORY-011 | Registration |
| STORY-013 | Result |
| STORY-016 | AuditLog |
| STORY-009 | Wallet and WalletEntry |
| STORY-010 | Payment |
| STORY-015 | WithdrawalRequest |

This table assigns persistence ownership only; the same story also owns the related types, interfaces, DTOs, validation schemas, shared contracts, and tests when concrete consumers require them. It does not authorize STORY-002 to create these artifacts early. A story may split its schema into multiple migrations and seeds when that makes deployment or rollback safer.

## Acceptance criteria

- Migrations create the database from scratch and can be applied through the CLI in CI.
- The application does not depend on automatic schema synchronization.
- Starting the API locally applies pending migrations before NestJS starts.
- Starting the production API does not attempt to acquire migration locks or modify the schema.
- Local Docker resources and database names do not collide with generically named PostgreSQL projects.
- A fresh database can run all currently available migrations and story-owned seeds in deterministic order.
- One migration can be applied and reverted through the TypeORM CLI in an integration test.
- No entity for a future domain story is created in advance.

## Verification

Start the project-scoped database, run and revert the foundation migration through the TypeORM CLI, run the currently available story seeds, and run integration tests against the isolated test database.
