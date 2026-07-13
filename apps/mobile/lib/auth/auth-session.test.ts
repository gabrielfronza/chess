const mockPerformAsync = jest.fn();

jest.mock('expo-auth-session', () => ({
  AccessTokenRequest: jest.fn().mockImplementation((config) => ({
    config,
    performAsync: mockPerformAsync,
  })),
  ResponseType: {
    Code: 'code',
  },
  makeRedirectUri: jest.fn(() => 'checkmatetour://auth/callback'),
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

import { AccessTokenRequest, makeRedirectUri } from 'expo-auth-session';
import { Auth0Session, auth0Scopes } from './auth-session';

describe('auth-session', () => {
  it('normalizes Auth0 issuer and discovery URLs', () => {
    expect(Auth0Session.createIssuer('https://example.auth0.com/')).toBe(
      'https://example.auth0.com',
    );
    expect(Auth0Session.createDiscovery('example.auth0.com')).toEqual({
      authorizationEndpoint: 'https://example.auth0.com/authorize',
      revocationEndpoint: 'https://example.auth0.com/oauth/revoke',
      tokenEndpoint: 'https://example.auth0.com/oauth/token',
      userInfoEndpoint: 'https://example.auth0.com/userinfo',
    });
  });

  it('creates the configured redirect URI', () => {
    expect(Auth0Session.createRedirectUri()).toBe(
      'checkmatetour://auth/callback',
    );
    expect(makeRedirectUri).toHaveBeenCalledWith({
      path: 'auth/callback',
      scheme: 'checkmatetour',
    });
  });

  it('creates a PKCE authorization request config', () => {
    expect(
      Auth0Session.createRequestConfig(
        {
          auth0Audience: 'https://api.chess.local',
          auth0ClientId: 'client-id',
          auth0Domain: 'example.auth0.com',
        },
        'checkmatetour://auth/callback',
      ),
    ).toEqual({
      clientId: 'client-id',
      extraParams: {
        audience: 'https://api.chess.local',
      },
      redirectUri: 'checkmatetour://auth/callback',
      responseType: 'code',
      scopes: auth0Scopes,
      usePKCE: true,
    });
  });

  it('exchanges an authorization code with the PKCE verifier', async () => {
    mockPerformAsync.mockResolvedValue({ accessToken: 'access-token' });
    const auth0Session = new Auth0Session();

    await expect(
      auth0Session.exchangeCodeForTokenResponse({
        clientId: 'client-id',
        code: 'auth-code',
        codeVerifier: 'code-verifier',
        discovery: { tokenEndpoint: 'https://example.auth0.com/oauth/token' },
        redirectUri: 'checkmatetour://auth/callback',
      }),
    ).resolves.toEqual({ accessToken: 'access-token' });

    expect(AccessTokenRequest).toHaveBeenCalledWith({
      clientId: 'client-id',
      code: 'auth-code',
      extraParams: {
        code_verifier: 'code-verifier',
      },
      redirectUri: 'checkmatetour://auth/callback',
    });
    expect(mockPerformAsync).toHaveBeenCalledWith({
      tokenEndpoint: 'https://example.auth0.com/oauth/token',
    });
  });
});
