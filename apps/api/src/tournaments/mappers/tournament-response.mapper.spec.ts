import { Tournament } from '../entities';
import { TournamentResponseMapper } from './tournament-response.mapper';

describe('TournamentResponseMapper', () => {
  it('maps dates and nullable fields to the API contract', () => {
    const tournament = {
      cancellationReason: null,
      createdAt: new Date('2026-07-16T12:00:00.000Z'),
      description: null,
      durationMinutes: null,
      entryFeeCents: 0,
      id: 'id',
      lichessTournamentId: null,
      name: 'Rapid',
      prizePoolCents: 0,
      refundStatus: 'NONE',
      registrationCount: 0,
      rounds: null,
      rules: null,
      startsAt: null,
      status: 'DRAFT',
      timeControl: null,
      updatedAt: new Date('2026-07-16T13:00:00.000Z'),
    } as Tournament;

    expect(new TournamentResponseMapper().toResponse(tournament)).toEqual(
      expect.objectContaining({
        createdAt: '2026-07-16T12:00:00.000Z',
        startsAt: null,
        updatedAt: '2026-07-16T13:00:00.000Z',
      }),
    );
  });

  it('omits administrative fields from marketplace responses', () => {
    const tournament = {
      cancellationReason: null,
      createdAt: new Date('2026-07-16T12:00:00.000Z'),
      refundStatus: 'NONE',
      startsAt: new Date('2026-08-01T12:00:00.000Z'),
      updatedAt: new Date('2026-07-16T13:00:00.000Z'),
    } as Tournament;

    expect(
      new TournamentResponseMapper().toMarketplaceResponse(tournament),
    ).not.toEqual(
      expect.objectContaining({
        cancellationReason: null,
        refundStatus: 'NONE',
      }),
    );
  });
});
