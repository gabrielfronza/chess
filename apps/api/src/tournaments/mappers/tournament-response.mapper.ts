import { Injectable } from '@nestjs/common';
import type {
  MarketplaceTournamentResponse,
  TournamentResponse,
} from '@checkmatetour/contracts';
import { Tournament } from '../entities';

@Injectable()
export class TournamentResponseMapper {
  toMarketplaceResponse(tournament: Tournament): MarketplaceTournamentResponse {
    return {
      createdAt: tournament.createdAt.toISOString(),
      description: tournament.description,
      durationMinutes: tournament.durationMinutes,
      entryFeeCents: tournament.entryFeeCents,
      id: tournament.id,
      lichessTournamentId: tournament.lichessTournamentId,
      name: tournament.name,
      prizePoolCents: tournament.prizePoolCents,
      registrationCount: tournament.registrationCount,
      rounds: tournament.rounds,
      rules: tournament.rules,
      startsAt: tournament.startsAt?.toISOString() ?? null,
      status: tournament.status,
      timeControl: tournament.timeControl,
      updatedAt: tournament.updatedAt.toISOString(),
    };
  }

  toResponse(tournament: Tournament): TournamentResponse {
    return {
      cancellationReason: tournament.cancellationReason,
      createdAt: tournament.createdAt.toISOString(),
      description: tournament.description,
      durationMinutes: tournament.durationMinutes,
      entryFeeCents: tournament.entryFeeCents,
      id: tournament.id,
      lichessTournamentId: tournament.lichessTournamentId,
      name: tournament.name,
      prizePoolCents: tournament.prizePoolCents,
      refundStatus: tournament.refundStatus,
      registrationCount: tournament.registrationCount,
      rounds: tournament.rounds,
      rules: tournament.rules,
      startsAt: tournament.startsAt?.toISOString() ?? null,
      status: tournament.status,
      timeControl: tournament.timeControl,
      updatedAt: tournament.updatedAt.toISOString(),
    };
  }
}
