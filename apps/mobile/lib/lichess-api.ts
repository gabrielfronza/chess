import { createBearerHeaders, httpClient } from './http-client';

export type LichessOAuthStartResponse = {
  authorizationUrl: string;
  expiresAt: string;
  state: string;
};

export type CompleteLichessOAuthRequest = {
  code: string;
  state: string;
};

export type LichessAccountResponse = {
  id: string;
  linkedAt: string;
  lichessUserId: string;
  revokedAt: string | null;
  username: string;
};

export type LichessApi = {
  completeOAuth(
    accessToken: string,
    request: CompleteLichessOAuthRequest,
  ): Promise<LichessAccountResponse>;
  getLinkedAccount(accessToken: string): Promise<LichessAccountResponse>;
  revokeLinkedAccount(accessToken: string): Promise<void>;
  startOAuth(accessToken: string): Promise<LichessOAuthStartResponse>;
};

export const lichessApi: LichessApi = {
  completeOAuth(accessToken: string, request: CompleteLichessOAuthRequest) {
    return httpClient.post<LichessAccountResponse>('/lichess/oauth/complete', {
      body: request,
      headers: createBearerHeaders(accessToken),
    });
  },
  getLinkedAccount(accessToken: string) {
    return httpClient.get<LichessAccountResponse>('/lichess/account', {
      headers: createBearerHeaders(accessToken),
    });
  },
  revokeLinkedAccount(accessToken: string) {
    return httpClient.delete('/lichess/account', {
      headers: createBearerHeaders(accessToken),
    });
  },
  startOAuth(accessToken: string) {
    return httpClient.post<LichessOAuthStartResponse>('/lichess/oauth/start', {
      headers: createBearerHeaders(accessToken),
    });
  },
};
