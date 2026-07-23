import type {
  WalletBalanceResponse,
  WalletHistoryPageResponse,
} from '@checkmatetour/contracts';
import { createBearerHeaders, httpClient } from './http-client';

export type WalletApi = {
  getBalance(accessToken: string): Promise<WalletBalanceResponse>;
  getHistory(
    accessToken: string,
    page?: number,
    pageSize?: number,
  ): Promise<WalletHistoryPageResponse>;
};

export const walletApi: WalletApi = {
  getBalance(accessToken) {
    return httpClient.get<WalletBalanceResponse>('/wallet', {
      headers: createBearerHeaders(accessToken),
    });
  },
  getHistory(accessToken, page = 1, pageSize = 20) {
    return httpClient.get<WalletHistoryPageResponse>(
      `/wallet/entries?page=${page}&pageSize=${pageSize}`,
      { headers: createBearerHeaders(accessToken) },
    );
  },
};
