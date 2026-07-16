import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../../config/environment';
import { LichessAccountProfile, LichessTokenResponse } from '../types';

const requestTimeoutMs = 5000;

@Injectable()
export class LichessApiClient {
  constructor(
    private readonly configService: ConfigService<Environment, true>,
  ) {}

  buildAuthorizationUrl({
    codeChallenge,
    redirectUri,
    state,
  }: {
    codeChallenge: string;
    redirectUri: string;
    state: string;
  }): string {
    const url = new URL('/oauth', this.baseUrl);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('code_challenge_method', 'S256');
    url.searchParams.set('code_challenge', codeChallenge);
    url.searchParams.set('state', state);

    return url.toString();
  }

  async exchangeAuthorizationCode({
    code,
    codeVerifier,
    redirectUri,
  }: {
    code: string;
    codeVerifier: string;
    redirectUri: string;
  }): Promise<LichessTokenResponse> {
    const body = new URLSearchParams({
      client_id: this.clientId,
      code,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });

    return this.fetchJson<LichessTokenResponse>('/api/token', {
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    });
  }

  async getAccount(accessToken: string): Promise<LichessAccountProfile> {
    return this.fetchJson<LichessAccountProfile>('/api/account', {
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
    });
  }

  async revokeAccessToken(accessToken: string): Promise<void> {
    await this.fetchJson<void>('/api/token', {
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'DELETE',
    });
  }

  private get baseUrl(): string {
    return this.configService.get('LICHESS_BASE_URL', { infer: true });
  }

  private get clientId(): string {
    return this.configService.get('LICHESS_CLIENT_ID', { infer: true });
  }

  private async fetchJson<ResponseBody>(
    path: string,
    init: RequestInit,
  ): Promise<ResponseBody> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

    try {
      const response = await fetch(new URL(path, this.baseUrl), {
        ...init,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Lichess request failed with ${response.status}`);
      }

      if (response.status === 204) {
        return undefined as ResponseBody;
      }

      return (await response.json()) as ResponseBody;
    } finally {
      clearTimeout(timeout);
    }
  }
}
