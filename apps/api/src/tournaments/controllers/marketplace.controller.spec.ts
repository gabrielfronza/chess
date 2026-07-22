import { Tournament } from '../entities';
import { TournamentResponseMapper } from '../mappers';
import { TournamentsService } from '../services';
import { MarketplaceController } from './marketplace.controller';

describe('MarketplaceController', () => {
  const tournament = {
    cancellationReason: null,
    createdAt: new Date('2026-07-01T12:00:00.000Z'),
    description: 'Open rapid event',
    durationMinutes: 60,
    entryFeeCents: 0,
    id: 'id',
    lichessTournamentId: 'abc123',
    name: 'Rapid',
    prizePoolCents: 10000,
    refundStatus: 'NONE',
    registrationCount: 4,
    rounds: 5,
    rules: 'Rules',
    startsAt: new Date('2026-08-01T12:00:00.000Z'),
    status: 'PUBLISHED',
    timeControl: '5+3',
    updatedAt: new Date('2026-07-02T12:00:00.000Z'),
  } as Tournament;
  const service = {
    findMarketplacePage: jest.fn().mockResolvedValue({
      items: [tournament],
      page: 1,
      pageSize: 20,
      total: 1,
      totalPages: 1,
    }),
    findMarketplaceTournament: jest.fn().mockResolvedValue(tournament),
  } as unknown as jest.Mocked<TournamentsService>;
  const controller = new MarketplaceController(
    new TournamentResponseMapper(),
    service,
  );

  it('maps a paginated marketplace response', async () => {
    await expect(controller.findAll({})).resolves.toEqual(
      expect.objectContaining({
        items: [expect.objectContaining({ id: 'id' })],
        total: 1,
      }),
    );
    expect(service.findMarketplacePage.mock.calls).toContainEqual([1, 20]);
  });

  it('maps marketplace details', async () => {
    await expect(controller.findOne('id')).resolves.toEqual(
      expect.objectContaining({ id: 'id', name: 'Rapid' }),
    );
  });
});
