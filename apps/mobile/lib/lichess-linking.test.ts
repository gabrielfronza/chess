import {
  extractLichessOAuthCallbackParams,
  getRedirectUriFromAuthorizationUrl,
  linkLichessAccount,
} from './lichess-linking';
import { type LichessApi } from './lichess-api';

describe('Lichess linking', () => {
  const linkedAccount = {
    id: 'account-id',
    lichessUserId: 'lichess-user-id',
    linkedAt: '2026-01-01T00:00:00.000Z',
    revokedAt: null,
    username: 'PlayerOne',
  };

  function createApi(): LichessApi {
    return {
      completeOAuth: jest.fn().mockResolvedValue(linkedAccount),
      getLinkedAccount: jest.fn().mockResolvedValue(linkedAccount),
      revokeLinkedAccount: jest.fn().mockResolvedValue(undefined),
      startOAuth: jest.fn().mockResolvedValue({
        authorizationUrl:
          'https://lichess.org/oauth?redirect_uri=checkmatetour%3A%2F%2Flichess%2Fcallback',
        expiresAt: '2026-01-01T00:10:00.000Z',
        state: 'state',
      }),
    };
  }

  it('opens Lichess OAuth and completes the callback', async () => {
    const apiClient = createApi();
    const openAuthSessionAsync = jest.fn().mockResolvedValue({
      type: 'success',
      url: 'checkmatetour://lichess/callback?code=code&state=state',
    });

    await expect(
      linkLichessAccount({
        accessToken: 'access-token',
        apiClient,
        openAuthSessionAsync,
      }),
    ).resolves.toEqual(linkedAccount);
    expect(apiClient.startOAuth).toHaveBeenCalledWith('access-token');
    expect(openAuthSessionAsync).toHaveBeenCalledWith(
      'https://lichess.org/oauth?redirect_uri=checkmatetour%3A%2F%2Flichess%2Fcallback',
      'checkmatetour://lichess/callback',
    );
    expect(apiClient.completeOAuth).toHaveBeenCalledWith('access-token', {
      code: 'code',
      state: 'state',
    });
  });

  it('returns null when the browser flow is cancelled', async () => {
    const apiClient = createApi();

    await expect(
      linkLichessAccount({
        accessToken: 'access-token',
        apiClient,
        openAuthSessionAsync: jest.fn().mockResolvedValue({ type: 'cancel' }),
      }),
    ).resolves.toBeNull();
    expect(apiClient.completeOAuth).not.toHaveBeenCalled();
  });

  it('rejects callback state mismatches before calling the API', async () => {
    const apiClient = createApi();

    await expect(
      linkLichessAccount({
        accessToken: 'access-token',
        apiClient,
        openAuthSessionAsync: jest.fn().mockResolvedValue({
          type: 'success',
          url: 'checkmatetour://lichess/callback?code=code&state=other',
        }),
      }),
    ).rejects.toThrow('Lichess returned an unexpected OAuth state');
    expect(apiClient.completeOAuth).not.toHaveBeenCalled();
  });

  it('extracts callback code and state', () => {
    expect(
      extractLichessOAuthCallbackParams(
        'checkmatetour://lichess/callback?code=code&state=state',
      ),
    ).toEqual({ code: 'code', state: 'state' });
  });

  it('rejects incomplete callbacks', () => {
    expect(() =>
      extractLichessOAuthCallbackParams(
        'checkmatetour://lichess/callback?code=code',
      ),
    ).toThrow('Lichess did not return a complete OAuth callback');
  });

  it('uses the default callback when the authorization URL omits one', () => {
    expect(
      getRedirectUriFromAuthorizationUrl('https://lichess.org/oauth'),
    ).toBe('checkmatetour://lichess/callback');
  });
});
