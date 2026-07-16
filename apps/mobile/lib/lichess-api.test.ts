import { httpClient } from './http-client';
import { lichessApi } from './lichess-api';

jest.mock('./http-client', () => ({
  createBearerHeaders: (accessToken: string) => ({
    Authorization: `Bearer ${accessToken}`,
  }),
  httpClient: {
    delete: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('lichessApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts Lichess OAuth with a bearer token', async () => {
    (httpClient.post as jest.Mock).mockResolvedValue({
      authorizationUrl: 'https://lichess.org/oauth',
      state: 'state',
    });

    await expect(lichessApi.startOAuth('access-token')).resolves.toEqual({
      authorizationUrl: 'https://lichess.org/oauth',
      state: 'state',
    });
    expect(httpClient.post).toHaveBeenCalledWith('/lichess/oauth/start', {
      headers: { Authorization: 'Bearer access-token' },
    });
  });

  it('completes Lichess OAuth with a code and state', async () => {
    (httpClient.post as jest.Mock).mockResolvedValue({
      username: 'PlayerOne',
    });

    await expect(
      lichessApi.completeOAuth('access-token', {
        code: 'code',
        state: 'state',
      }),
    ).resolves.toEqual({ username: 'PlayerOne' });
    expect(httpClient.post).toHaveBeenCalledWith('/lichess/oauth/complete', {
      body: { code: 'code', state: 'state' },
      headers: { Authorization: 'Bearer access-token' },
    });
  });

  it('loads the linked Lichess account', async () => {
    (httpClient.get as jest.Mock).mockResolvedValue({
      username: 'PlayerOne',
    });

    await expect(lichessApi.getLinkedAccount('access-token')).resolves.toEqual({
      username: 'PlayerOne',
    });
    expect(httpClient.get).toHaveBeenCalledWith('/lichess/account', {
      headers: { Authorization: 'Bearer access-token' },
    });
  });

  it('revokes the linked Lichess account', async () => {
    (httpClient.delete as jest.Mock).mockResolvedValue(undefined);

    await expect(
      lichessApi.revokeLinkedAccount('access-token'),
    ).resolves.toBeUndefined();
    expect(httpClient.delete).toHaveBeenCalledWith('/lichess/account', {
      headers: { Authorization: 'Bearer access-token' },
    });
  });
});
