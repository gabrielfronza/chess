/* istanbul ignore file -- local API fixture CLI */
import type {
  CreateTournamentRequest,
  TournamentResponse,
  TournamentStatus,
} from '@checkmatetour/contracts';

const apiBaseUrl = (
  process.env.API_BASE_URL ?? 'http://localhost:3000/api/v1'
).replace(/\/$/, '');
const accessToken = process.env.ADMIN_ACCESS_TOKEN;

const targetStatuses: TournamentStatus[] = [
  'DRAFT',
  'PUBLISHED',
  'REGISTRATION_CLOSED',
  'RUNNING',
  'FINISHED',
  'CANCELLED',
];

const transitions: Partial<Record<TournamentStatus, TournamentStatus[]>> = {
  FINISHED: ['REGISTRATION_CLOSED', 'RUNNING', 'FINISHED'],
  REGISTRATION_CLOSED: ['REGISTRATION_CLOSED'],
  RUNNING: ['REGISTRATION_CLOSED', 'RUNNING'],
};

async function main(): Promise<void> {
  if (!accessToken) {
    throw new Error(
      'ADMIN_ACCESS_TOKEN is required. Use a valid Auth0 token for an ADMIN user.',
    );
  }

  const fixtureRun = Date.now().toString(36);
  const created: TournamentResponse[] = [];

  for (const [index, targetStatus] of targetStatuses.entries()) {
    let tournament = await request<TournamentResponse>('/admin/tournaments', {
      body: createTournamentInput(targetStatus, fixtureRun, index),
      method: 'POST',
    });

    if (targetStatus !== 'DRAFT') {
      tournament = await request<TournamentResponse>(
        `/admin/tournaments/${tournament.id}/publish`,
        { method: 'POST' },
      );
    }

    for (const status of transitions[targetStatus] ?? []) {
      tournament = await request<TournamentResponse>(
        `/admin/tournaments/${tournament.id}/transition`,
        { body: { status }, method: 'POST' },
      );
    }

    if (targetStatus === 'CANCELLED') {
      tournament = await request<TournamentResponse>(
        `/admin/tournaments/${tournament.id}/cancel`,
        {
          body: { reason: 'Story 8 cancelled-state fixture' },
          method: 'POST',
        },
      );
    }

    created.push(tournament);
    console.log(`${tournament.status}: ${tournament.name} (${tournament.id})`);
  }

  console.log(`Created ${created.length} tournament status fixtures.`);
}

function createTournamentInput(
  targetStatus: TournamentStatus,
  fixtureRun: string,
  index: number,
): CreateTournamentRequest {
  const startsAt = new Date(Date.now() + (index + 1) * 86_400_000);

  return {
    description: `Local marketplace fixture targeting ${targetStatus}.`,
    durationMinutes: 90,
    entryFeeCents: 0,
    lichessTournamentId: `fixture-${fixtureRun}-${index}`,
    name: `Fixture ${targetStatus.replaceAll('_', ' ')}`,
    prizePoolCents: 10_000,
    rounds: 5,
    rules: 'Standard fair-play and tournament rules apply.',
    startsAt: startsAt.toISOString(),
    timeControl: '5+3',
  };
}

async function request<ResponseBody>(
  path: string,
  options: { body?: unknown; method: 'POST' },
): Promise<ResponseBody> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    method: options.method,
  });

  if (!response.ok) {
    const responseBody = await response.text();

    throw new Error(
      `${options.method} ${path} failed with ${response.status}: ${responseBody}`,
    );
  }

  return (await response.json()) as ResponseBody;
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
