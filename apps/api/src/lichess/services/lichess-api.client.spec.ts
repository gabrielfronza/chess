import { ConfigService } from '@nestjs/config';
import { LichessApiClient } from './lichess-api.client';

describe('LichessApiClient', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock;
  });

  it('builds the Lichess authorization URL with PKCE parameters', () => {
    const client = new LichessApiClient(createConfigService());

    expect(
      client.buildAuthorizationUrl({
        codeChallenge: 'challenge',
        redirectUri: 'checkmatetour://lichess/callback',
        state: 'state',
      }),
    ).toBe(
      'https://lichess.dev/oauth?response_type=code&client_id=checkmatetour&redirect_uri=checkmatetour%3A%2F%2Flichess%2Fcallback&code_challenge_method=S256&code_challenge=challenge&state=state',
    );
  });

  it('exchanges authorization codes as form data', async () => {
    fetchMock.mockResolvedValue({
      json: () => Promise.resolve({ access_token: 'token', expires_in: 100 }),
      ok: true,
      status: 200,
    });
    const client = new LichessApiClient(createConfigService());

    await expect(
      client.exchangeAuthorizationCode({
        code: 'code',
        codeVerifier: 'verifier',
        redirectUri: 'checkmatetour://lichess/callback',
      }),
    ).resolves.toEqual({ access_token: 'token', expires_in: 100 });

    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://lichess.dev/api/token'),
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });

  it('loads the current Lichess account with a bearer token', async () => {
    fetchMock.mockResolvedValue({
      json: () => Promise.resolve({ id: 'lichess-id', username: 'PlayerOne' }),
      ok: true,
      status: 200,
    });
    const client = new LichessApiClient(createConfigService());

    await expect(client.getAccount('token')).resolves.toEqual({
      id: 'lichess-id',
      username: 'PlayerOne',
    });
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://lichess.dev/api/account'),
      expect.objectContaining({
        headers: { Authorization: 'Bearer token' },
        method: 'GET',
      }),
    );
  });

  it('revokes the Lichess access token', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 204,
    });
    const client = new LichessApiClient(createConfigService());

    await expect(client.revokeAccessToken('token')).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://lichess.dev/api/token'),
      expect.objectContaining({
        headers: { Authorization: 'Bearer token' },
        method: 'DELETE',
      }),
    );
  });

  it('surfaces recoverable failures for non-2xx responses', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503 });
    const client = new LichessApiClient(createConfigService());

    await expect(client.getAccount('token')).rejects.toThrow(
      'Lichess request failed with 503',
    );
  });
});

function createConfigService(): ConfigService {
  return {
    get: jest.fn((key: string) => {
      const values: Record<string, string> = {
        LICHESS_BASE_URL: 'https://lichess.dev',
        LICHESS_CLIENT_ID: 'checkmatetour',
      };

      return values[key];
    }),
  } as unknown as ConfigService;
}
