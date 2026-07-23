# STORY-026 — Domain and persistence boundaries

**Status:** ready
**Dependencies:** STORY-009

## Story

As a developer, I want business rules separated from database access so domain
behavior is easy to understand, test, and reuse without coupling it to TypeORM.

## Problem

Some application services currently mix persistence queries, transaction and
locking details, balance calculations, validation, and exception selection in a
single class. `WalletService` is the clearest example: it loads and locks records,
evaluates ledger rules, mutates balances, and writes entities.

Moving database access into controllers would replace one mixed boundary with
another. Controllers must remain thin HTTP adapters. Application services should
coordinate the use case, repositories should own persistence, and domain classes
or policies should evaluate business rules using values supplied to them.

Wallet operations must retain a single transaction around the locked read,
domain decision, balance write, and ledger insert. Reading outside that
transaction and writing later would introduce a race condition.

## Target flow

1. A controller validates and maps the HTTP request, then invokes an application
   use case.
2. The application service starts the required transaction and asks a repository
   to load the current state, including locks when necessary.
3. A persistence-free domain class receives plain values and evaluates business
   rules.
4. The domain class either returns the explicit state transition/domain result or
   raises a domain error.
5. The application service maps domain errors to application errors and asks the
   repository to persist the approved transition in the same transaction.
6. The controller maps the result to the response contract.

## Scope

- Introduce wallet repository interfaces and TypeORM implementations for wallet
  creation/loading, row locking, idempotency lookup, balance persistence, and
  immutable ledger insertion.
- Extract balance-transition rules from `WalletService` into a persistence-free
  wallet domain class or policy.
- Keep advisory locks, row locks, the idempotency lookup, wallet update, and ledger
  insert inside one application-level transaction.
- Replace NestJS HTTP exceptions inside the wallet domain layer with explicit
  domain errors; translate them at the application or HTTP boundary.
- Reduce `WalletService` to use-case orchestration, or split it into focused
  application use cases when that produces clearer dependencies.
- Establish shared conventions for controller, application, domain, and
  persistence responsibilities in `docs/ARCHITECTURE.md` and
  `docs/AGENT_GUIDE.md`.
- Review existing users, Lichess, and tournament services for the same mixing of
  business rules and TypeORM access. Record and implement low-risk extractions;
  create follow-up stories for changes that would materially expand scope.
- Preserve public API contracts and current mobile behavior.

## Out of scope

- Putting repositories, entity managers, or TypeORM queries in controllers.
- Replacing TypeORM or PostgreSQL.
- Introducing a generic repository abstraction for simple CRUD with no business
  rules.
- Removing transactions, row locks, advisory locks, immutable-ledger protection,
  or database uniqueness constraints.
- Changing wallet arithmetic, ledger event meanings, endpoint paths, or response
  shapes.

## Acceptance criteria

- Wallet domain-rule tests instantiate no NestJS module, repository, entity
  manager, or database connection.
- The wallet domain layer imports neither TypeORM nor NestJS HTTP exceptions.
- `WalletService` contains no inline balance arithmetic or direct TypeORM query
  strings.
- TypeORM-specific reads and writes are isolated behind wallet persistence
  adapters.
- Controllers contain no database calls and remain limited to transport
  validation, use-case invocation, and response mapping.
- A wallet operation performs its locked read, rule evaluation, wallet write, and
  ledger insert within one transaction.
- Concurrent requests cannot create negative balances or duplicate ledger
  entries.
- Reusing an idempotency key with the same payload returns the prior result;
  reusing it with different data remains a conflict.
- Domain errors are deterministically translated to the existing HTTP status and
  safe user-facing message.
- Existing API and mobile contracts remain compatible.
- The architecture documentation defines responsibilities and gives a small
  example of the intended request flow.
- The review of other modules is documented with completed extractions or linked
  follow-up stories.

## Verification

- Add table-driven unit tests for every wallet transition and rejection without
  mocking TypeORM.
- Add repository-adapter tests for wallet creation, locking, idempotency lookup,
  persistence, and immutable ledger insertion.
- Add integration tests proving rollback atomicity and concurrent reservation
  safety against PostgreSQL.
- Retain controller tests for validation, delegation, error mapping, and response
  mapping.
- Run API lint, build, unit coverage, database migration tests, and the relevant
  mobile wallet tests.
