import type {
  MarketplaceTournamentResponse,
  TournamentPageResponse,
} from '@checkmatetour/contracts';
import { createBearerHeaders, httpClient } from './http-client';

export type TournamentApi = {
  getTournament(
    accessToken: string,
    id: string,
  ): Promise<MarketplaceTournamentResponse>;
  listTournaments(
    accessToken: string,
    page?: number,
    pageSize?: number,
  ): Promise<TournamentPageResponse>;
};

export const tournamentApi: TournamentApi = {
  getTournament(accessToken, id) {
    return httpClient.get<MarketplaceTournamentResponse>(
      `/tournaments/${encodeURIComponent(id)}`,
      { headers: createBearerHeaders(accessToken) },
    );
  },
  listTournaments(accessToken, page = 1, pageSize = 20) {
    return httpClient.get<TournamentPageResponse>(
      `/tournaments?page=${page}&pageSize=${pageSize}`,
      { headers: createBearerHeaders(accessToken) },
    );
  },
};
