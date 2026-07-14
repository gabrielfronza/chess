import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { MobileConfig } from '../config';

WebBrowser.maybeCompleteAuthSession();

export const auth0Scopes = ['openid', 'profile', 'email', 'offline_access'];

export type Auth0SessionConfig = Pick<
  MobileConfig,
  'auth0Audience' | 'auth0ClientId' | 'auth0Domain'
>;

export class Auth0Session {
  public static createIssuer(domain: string): string {
    return `https://${domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
  }

  public static createDiscovery(domain: string): AuthSession.DiscoveryDocument {
    const issuer = Auth0Session.createIssuer(domain);

    return {
      authorizationEndpoint: `${issuer}/authorize`,
      tokenEndpoint: `${issuer}/oauth/token`,
      revocationEndpoint: `${issuer}/oauth/revoke`,
      userInfoEndpoint: `${issuer}/userinfo`,
    };
  }

  public static createRedirectUri(): string {
    return AuthSession.makeRedirectUri({
      path: 'auth/callback',
      scheme: 'checkmatetour',
    });
  }

  public static createRequestConfig(
    config: Auth0SessionConfig,
    redirectUri = Auth0Session.createRedirectUri(),
  ): AuthSession.AuthRequestConfig {
    return {
      clientId: config.auth0ClientId,
      extraParams: {
        audience: config.auth0Audience,
      },
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      scopes: auth0Scopes,
      usePKCE: true,
    };
  }

  public async exchangeCodeForTokenResponse({
    clientId,
    code,
    codeVerifier,
    discovery,
    redirectUri,
  }: {
    clientId: string;
    code: string;
    codeVerifier: string;
    discovery: Pick<AuthSession.DiscoveryDocument, 'tokenEndpoint'>;
    redirectUri: string;
  }): Promise<AuthSession.TokenResponse> {
    return new AuthSession.AccessTokenRequest({
      clientId,
      code,
      extraParams: {
        code_verifier: codeVerifier,
      },
      redirectUri,
    }).performAsync(discovery);
  }
}
