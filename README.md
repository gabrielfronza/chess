# Chess Tournament Platform

MVP foundation for paid chess tournaments. The platform manages users, registrations, wallets, payments, and prizes; Lichess manages games, pairings, and standings.

## Structure

- `apps/mobile`: React Native application with Expo and TypeScript.
- `apps/api`: NestJS API with TypeScript.
- `packages/contracts`: shared contracts (to be implemented in Story 01).
- `docs/IMPLEMENTATION_PLAN.md`: MVP implementation order.
- `docs/stories`: executable backlog, one story per file.

## Prerequisites

- Node.js 22 LTS (Node 23 is not supported by the current Expo Metro version).
- npm 10 or later.
- Docker, starting with the infrastructure story.

## Getting started

```bash
nvm use
npm --prefix apps/api install
npm --prefix apps/mobile install
npm run dev:api
```

In another terminal:

```bash
npm run dev:mobile
```

The initial API responds at `http://localhost:3000`. Future variables are documented in `.env.example` and must be configured story by story.

## Running the backlog with agents

1. Choose only a `ready` story whose dependencies are complete.
2. Send the agent the story file, `docs/AGENT_GUIDE.md`, and the files listed under “Context.”
3. Require tests and the commands from the “Verification” section.
4. Review the acceptance criteria before marking the story as `done`.
5. Stories in the same wave should only run in parallel when they do not change the same modules.

See the [implementation plan](docs/IMPLEMENTATION_PLAN.md) for the complete sequence.
