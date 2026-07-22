import { httpClient } from './http-client';
import { tournamentApi } from './tournament-api';

jest.mock('./http-client', () => ({
  createBearerHeaders: (accessToken: string) => ({
    Authorization: `Bearer ${accessToken}`,
  }),
  httpClient: { get: jest.fn() },
}));

describe('tournamentApi', () => {
  beforeEach(() => jest.clearAllMocks());

  it('loads a paginated tournament marketplace', async () => {
    (httpClient.get as jest.Mock).mockResolvedValue({ items: [] });

    await tournamentApi.listTournaments('token', 2, 10);

    expect(httpClient.get).toHaveBeenCalledWith(
      '/tournaments?page=2&pageSize=10',
      { headers: { Authorization: 'Bearer token' } },
    );
  });

  it('loads encoded tournament details', async () => {
    (httpClient.get as jest.Mock).mockResolvedValue({ id: 'event/id' });

    await tournamentApi.getTournament('token', 'event/id');

    expect(httpClient.get).toHaveBeenCalledWith('/tournaments/event%2Fid', {
      headers: { Authorization: 'Bearer token' },
    });
  });
});
