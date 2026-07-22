import type { MarketplaceTournamentResponse } from '@checkmatetour/contracts';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { TournamentsContent } from '../app/(app)/tournaments';
import { TournamentDetailContent } from '../app/(app)/tournaments/[id]';
import type { StoredAuthSessionState } from '../lib/auth/use-stored-auth-session';
import type { TournamentApi } from '../lib/tournament-api';

jest.mock('expo-router', () => {
  const { Text: MockText } = jest.requireActual('react-native');

  return {
    Link: ({ children }: { children: React.ReactNode }) => (
      <MockText>{children}</MockText>
    ),
  };
});

const authSession: StoredAuthSessionState = {
  isAuthenticated: true,
  isLoading: false,
  session: {
    accessToken: 'token',
    expiresAt: Date.now() + 60_000,
    idToken: null,
    refreshToken: null,
  },
};

const tournament: MarketplaceTournamentResponse = {
  createdAt: '2026-07-01T12:00:00.000Z',
  description: 'Five rounds of rapid chess.',
  durationMinutes: 90,
  entryFeeCents: 0,
  id: 'event-id',
  lichessTournamentId: 'abc123',
  name: 'Friday Rapid',
  prizePoolCents: 10000,
  registrationCount: 12,
  rounds: 5,
  rules: 'Standard fair play rules.',
  startsAt: '2026-08-01T12:00:00.000Z',
  status: 'PUBLISHED',
  timeControl: '5+3',
  updatedAt: '2026-07-02T12:00:00.000Z',
};

function createApi(overrides: Partial<TournamentApi> = {}): TournamentApi {
  return {
    getTournament: jest.fn().mockResolvedValue(tournament),
    listTournaments: jest.fn().mockResolvedValue({
      items: [tournament],
      page: 1,
      pageSize: 20,
      total: 1,
      totalPages: 1,
    }),
    ...overrides,
  };
}

describe('tournament marketplace screens', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders published tournament conditions in the list', async () => {
    const api = createApi();
    const screen = await render(
      <TournamentsContent
        authSession={authSession}
        tournamentApiClient={api}
      />,
    );

    await waitFor(() => expect(screen.getByText('Friday Rapid')).toBeTruthy());
    expect(screen.getByText('5+3 · 5 rounds')).toBeTruthy();
    expect(screen.getByText('Entry $0.00 · Prize $100.00')).toBeTruthy();
    expect(screen.getByText('12 participants · published')).toBeTruthy();
  });

  it('shows an empty state', async () => {
    const empty = await render(
      <TournamentsContent
        authSession={authSession}
        tournamentApiClient={createApi({
          listTournaments: jest.fn().mockResolvedValue({
            items: [],
            page: 1,
            pageSize: 20,
            total: 0,
            totalPages: 0,
          }),
        })}
      />,
    );
    await waitFor(() =>
      expect(empty.getByText('No tournaments available')).toBeTruthy(),
    );
  });

  it('retries a failed marketplace request', async () => {
    const failingApi = createApi({
      listTournaments: jest
        .fn()
        .mockRejectedValueOnce(new Error('Network unavailable'))
        .mockResolvedValue({
          items: [tournament],
          page: 1,
          pageSize: 20,
          total: 1,
          totalPages: 1,
        }),
    });
    const failed = await render(
      <TournamentsContent
        authSession={authSession}
        tournamentApiClient={failingApi}
      />,
    );
    await waitFor(() =>
      expect(failed.getByText('Network unavailable')).toBeTruthy(),
    );
    await fireEvent.press(failed.getByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(failed.getByText('Friday Rapid')).toBeTruthy());
  });

  it('merges subsequent pages without duplicate tournaments', async () => {
    const second = { ...tournament, id: 'second-id', name: 'Second Event' };
    const api = createApi({
      listTournaments: jest
        .fn()
        .mockResolvedValueOnce({
          items: [tournament],
          page: 1,
          pageSize: 20,
          total: 2,
          totalPages: 2,
        })
        .mockResolvedValueOnce({
          items: [tournament, second],
          page: 2,
          pageSize: 20,
          total: 2,
          totalPages: 2,
        }),
    });
    const screen = await render(
      <TournamentsContent
        authSession={authSession}
        tournamentApiClient={api}
      />,
    );
    await waitFor(() => expect(screen.getByText('Load more')).toBeTruthy());
    await fireEvent.press(screen.getByRole('button', { name: 'Load more' }));
    await waitFor(() => expect(screen.getByText('Second Event')).toBeTruthy());
    expect(screen.getAllByText('Friday Rapid')).toHaveLength(1);
  });

  it('renders details and explains unavailable registration', async () => {
    const screen = await render(
      <TournamentDetailContent
        authSession={authSession}
        id="event-id"
        tournamentApiClient={createApi()}
      />,
    );

    await waitFor(() => expect(screen.getByText('Friday Rapid')).toBeTruthy());
    expect(screen.getByText('Standard fair play rules.')).toBeTruthy();
    expect(
      screen.getByText(
        'Registration will be enabled with the registration flow in Story 11.',
      ),
    ).toBeTruthy();
  });
});
