import * as WebBrowser from 'expo-web-browser';
import {
  lichessApi,
  type LichessAccountResponse,
  type LichessApi,
} from './lichess-api';

WebBrowser.maybeCompleteAuthSession();

type OpenAuthSessionAsync = typeof WebBrowser.openAuthSessionAsync;

const defaultLichessRedirectUri = 'checkmatetour://lichess/callback';

export async function linkLichessAccount({
  accessToken,
  apiClient = lichessApi,
  openAuthSessionAsync = WebBrowser.openAuthSessionAsync,
}: {
  accessToken: string;
  apiClient?: LichessApi;
  openAuthSessionAsync?: OpenAuthSessionAsync;
}): Promise<LichessAccountResponse | null> {
  const oauth = await apiClient.startOAuth(accessToken);
  const callbackUrl = getRedirectUriFromAuthorizationUrl(
    oauth.authorizationUrl,
  );
  const result = await openAuthSessionAsync(
    oauth.authorizationUrl,
    callbackUrl,
  );

  if (result.type !== 'success') {
    return null;
  }

  const callbackParams = extractLichessOAuthCallbackParams(result.url);

  if (callbackParams.state !== oauth.state) {
    throw new Error('Lichess returned an unexpected OAuth state');
  }

  return apiClient.completeOAuth(accessToken, callbackParams);
}

export function extractLichessOAuthCallbackParams(callbackUrl: string): {
  code: string;
  state: string;
} {
  const url = new URL(callbackUrl);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    throw new Error('Lichess did not return a complete OAuth callback');
  }

  return { code, state };
}

export function getRedirectUriFromAuthorizationUrl(
  authorizationUrl: string,
): string {
  const redirectUri = new URL(authorizationUrl).searchParams.get(
    'redirect_uri',
  );

  return redirectUri ?? defaultLichessRedirectUri;
}
