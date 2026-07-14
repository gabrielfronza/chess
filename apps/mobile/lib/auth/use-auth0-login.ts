import * as AuthSession from 'expo-auth-session';
import { useCallback, useMemo } from 'react';
import { createMobileConfig, MobileConfig } from '../config';
import { Auth0Session } from './auth-session';
import { AuthTokenStorage } from './auth-token-storage';

export function useAuth0Login(
  config: Pick<
    MobileConfig,
    'auth0Audience' | 'auth0ClientId' | 'auth0Domain'
  > = createMobileConfig(),
) {
  const auth0Session = useMemo(() => new Auth0Session(), []);
  const authTokenStorage = useMemo(() => new AuthTokenStorage(), []);
  const redirectUri = useMemo(() => Auth0Session.createRedirectUri(), []);
  const discovery = useMemo(
    () => Auth0Session.createDiscovery(config.auth0Domain),
    [config.auth0Domain],
  );
  const requestConfig = useMemo(
    () => Auth0Session.createRequestConfig(config, redirectUri),
    [config, redirectUri],
  );
  const [request, , promptAsync] = AuthSession.useAuthRequest(
    requestConfig,
    discovery,
  );

  const signIn = useCallback(async () => {
    const result = await promptAsync();

    if (result.type !== 'success') {
      return null;
    }

    const code = result.params.code;

    if (!code || !request?.codeVerifier) {
      throw new Error(
        'Auth0 did not return a complete authorization code flow',
      );
    }

    const tokenResponse = await auth0Session.exchangeCodeForTokenResponse({
      clientId: config.auth0ClientId,
      code,
      codeVerifier: request.codeVerifier,
      discovery,
      redirectUri,
    });
    const session = authTokenStorage.toStoredSession(tokenResponse);

    await authTokenStorage.save(session);

    return session;
  }, [
    auth0Session,
    authTokenStorage,
    config.auth0ClientId,
    discovery,
    promptAsync,
    redirectUri,
    request,
  ]);

  const signOut = useCallback(async () => {
    await authTokenStorage.clear();
  }, [authTokenStorage]);

  return {
    ready: Boolean(request),
    signIn,
    signOut,
  };
}
