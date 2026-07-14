import { act, render } from '@testing-library/react-native';
import * as AuthSession from 'expo-auth-session';
import { useEffect } from 'react';
import { useAuth0Login } from './use-auth0-login';

const mockExchangeCodeForTokenResponse = jest.fn();
const mockClearAuthSession = jest.fn().mockResolvedValue(undefined);
const mockSaveAuthSession = jest.fn().mockResolvedValue(undefined);
const mockToStoredAuthSession = jest.fn(() => ({
  accessToken: 'access-token',
  expiresAt: null,
  idToken: null,
  refreshToken: null,
}));

jest.mock('expo-auth-session', () => ({
  useAuthRequest: jest.fn(),
}));

jest.mock('./auth-session', () => {
  const Auth0Session = Object.assign(
    jest.fn().mockImplementation(() => ({
      exchangeCodeForTokenResponse: mockExchangeCodeForTokenResponse,
    })),
    {
      createDiscovery: jest.fn(() => ({ tokenEndpoint: 'token-endpoint' })),
      createRedirectUri: jest.fn(() => 'checkmatetour://auth/callback'),
      createRequestConfig: jest.fn(() => ({ clientId: 'client-id' })),
    },
  );

  return { Auth0Session };
});

jest.mock('./auth-token-storage', () => ({
  AuthTokenStorage: jest.fn().mockImplementation(() => ({
    clear: mockClearAuthSession,
    save: mockSaveAuthSession,
    toStoredSession: mockToStoredAuthSession,
  })),
}));

type Auth0LoginState = ReturnType<typeof useAuth0Login>;

const config = {
  auth0Audience: 'https://api.chess.local',
  auth0ClientId: 'client-id',
  auth0Domain: 'example.auth0.com',
};

function Harness({ onReady }: { onReady: (state: Auth0LoginState) => void }) {
  const state = useAuth0Login(config);

  useEffect(() => {
    onReady(state);
  }, [onReady, state]);

  return null;
}

describe('useAuth0Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('prompts Auth0, exchanges the code, and stores the session', async () => {
    const promptAsync = jest.fn().mockResolvedValue({
      params: { code: 'auth-code' },
      type: 'success',
    });
    (AuthSession.useAuthRequest as jest.Mock).mockReturnValue([
      { codeVerifier: 'code-verifier' },
      null,
      promptAsync,
    ]);
    mockExchangeCodeForTokenResponse.mockResolvedValue({
      accessToken: 'access-token',
    });
    let state: Auth0LoginState | undefined;

    await render(<Harness onReady={(nextState) => (state = nextState)} />);
    await act(async () => {
      await expect(state?.signIn()).resolves.toEqual({
        accessToken: 'access-token',
        expiresAt: null,
        idToken: null,
        refreshToken: null,
      });
    });

    expect(mockExchangeCodeForTokenResponse).toHaveBeenCalledWith({
      clientId: 'client-id',
      code: 'auth-code',
      codeVerifier: 'code-verifier',
      discovery: { tokenEndpoint: 'token-endpoint' },
      redirectUri: 'checkmatetour://auth/callback',
    });
    expect(mockSaveAuthSession).toHaveBeenCalledWith({
      accessToken: 'access-token',
      expiresAt: null,
      idToken: null,
      refreshToken: null,
    });
  });

  it('does not store a session when the user cancels login', async () => {
    (AuthSession.useAuthRequest as jest.Mock).mockReturnValue([
      { codeVerifier: 'code-verifier' },
      null,
      jest.fn().mockResolvedValue({ type: 'cancel' }),
    ]);
    let state: Auth0LoginState | undefined;

    await render(<Harness onReady={(nextState) => (state = nextState)} />);

    await act(async () => {
      await expect(state?.signIn()).resolves.toBeNull();
    });
    expect(mockSaveAuthSession).not.toHaveBeenCalled();
  });

  it('clears the local session on sign out', async () => {
    (AuthSession.useAuthRequest as jest.Mock).mockReturnValue([
      null,
      null,
      jest.fn(),
    ]);
    let state: Auth0LoginState | undefined;

    await render(<Harness onReady={(nextState) => (state = nextState)} />);

    await act(async () => {
      await state?.signOut();
    });
    expect(mockClearAuthSession).toHaveBeenCalled();
  });
});
