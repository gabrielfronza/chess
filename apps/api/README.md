# API

NestJS API for the chess tournament platform.

Run it from the repository root so Nx owns the command:

```bash
npm run dev:api
```

The health endpoint is available at `http://localhost:3000/api/v1/health`.

## Wallet endpoints

All wallet endpoints require a bearer access token. Monetary values are integer
US-dollar cents. Each stored balance or ledger amount supports up to
2,147,483,647 cents ($21,474,836.47).

- `GET /api/v1/wallet` returns the authenticated user's available and reserved balances.
- `GET /api/v1/wallet/entries?page=1&pageSize=20` returns paginated ledger entries. `pageSize` is limited to 50.
- `POST /api/v1/admin/wallets/:userId/adjustments` requires an administrator. Its JSON body contains a non-zero `amountCents`, an `idempotencyKey` of 8–200 characters, a `reason` of 3–1000 characters, and an optional `reference` of up to 200 characters. Positive amounts credit the available balance and negative amounts debit it. Reusing an idempotency key with different adjustment data returns a conflict.

Every controller must have a colocated `*.controller.spec.ts` covering its
validation, service delegation, and response mapping as applicable.

## Project commands

```bash
# From the repository root
npx nx serve api
npx nx lint api
npx nx test api
npx nx build api
```

The API reads `NODE_ENV`, `APP_VERSION`, and `PORT` in STORY-001. Copy the root `.env.example` to `.env` and adjust values for local development. Database configuration and migrations are introduced in STORY-002.

See the root [README](../../README.md) for setup and workspace commands, and [STORY-001](../../docs/stories/STORY-001-foundation.md) for the delivered foundation scope.
