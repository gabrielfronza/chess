# API

NestJS API for the chess tournament platform.

Run it from the repository root so Nx owns the command:

```bash
npm run dev:api
```

The health endpoint is available at `http://localhost:3000/api/v1/health`.

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
