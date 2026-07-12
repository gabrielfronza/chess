# Chess Tournament Platform

MVP foundation for paid chess tournaments. The platform manages users, registrations, wallets, payments, and prizes; Lichess manages games, pairings, and standings.

## Structure

- `apps/mobile`: React Native application with Expo and TypeScript, registered as an Nx project.
- `apps/api`: NestJS API with TypeScript, registered as an Nx project.
- `packages/contracts`: cross-application contracts added incrementally by the story that introduces a concrete shared consumer; Story 01 creates only the package boundary and tooling.
- Nx is the root orchestrator for serve, build, lint, test, and E2E targets. Database-migration targets will be added in STORY-002.
- `docs/IMPLEMENTATION_PLAN.md`: MVP implementation order.
- `docs/stories`: executable backlog, one story per file.

## Prerequisites

- Node.js 22 LTS (Node 23 is not supported by the current Expo Metro version).
- npm 10 or later.
- Docker, starting with the infrastructure story.

## Getting started

```bash
nvm use
npm ci
npm ci --prefix apps/api
npm ci --prefix apps/mobile
npm ci --prefix packages/contracts
npm run dev:api
```

In another terminal:

```bash
npm run dev:mobile
```

The API health endpoint responds at `http://localhost:3000/api/v1/health`.

Environment variables are documented in `.env.example`. STORY-001 validates `NODE_ENV`, `APP_VERSION`, and `PORT`; variables owned by later stories are activated when those stories are implemented.

## Workspace commands

```bash
# Inspect the project graph
npx nx show projects
npx nx graph

# Run quality targets across the workspace
npm run lint
npm run test:unit
npm run build

# Run one project target
npx nx test api
npx nx build mobile

# Run unit tests with the enforced 90% coverage threshold
npm run test:cov --prefix apps/api
npm run test:cov --prefix apps/mobile

# Start both applications
npm run dev

# Run the current Playwright API smoke test
npm run test:e2e
```

CI uses `nx affected` to run lint, unit tests with coverage, and builds only for projects affected by a pull request or push. The manual E2E workflow currently runs an API smoke test; browser journeys across the Expo Web UI and API are delivered in STORY-017.

The API and mobile coverage commands produce HTML reports at `apps/api/coverage/lcov-report/index.html` and `apps/mobile/coverage/lcov-report/index.html`. When those tests run in CI, the reports are available for 14 days as `api-coverage-report` and `mobile-coverage-report` workflow artifacts.

## Running the backlog with agents

1. Choose only a `ready` story whose dependencies are complete.
2. Send the agent the story file, `docs/AGENT_GUIDE.md`, and the files listed under “Context.”
3. Require tests and the commands from the “Verification” section.
4. Review the acceptance criteria before marking the story as `done`.
5. Stories in the same wave should only run in parallel when they do not change the same modules.

See the [implementation plan](docs/IMPLEMENTATION_PLAN.md) for the complete sequence.
