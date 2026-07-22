import { Tournament } from '../entities';
import { TournamentResponseMapper } from '../mappers';
import { TournamentsService } from '../services';
import { TournamentsController } from './tournaments.controller';

describe('TournamentsController', () => {
  const user = { sub: 'auth0|admin' } as never;
  const tournament = createTournament();
  let controller: TournamentsController;
  let service: jest.Mocked<TournamentsService>;

  beforeEach(() => {
    service = {
      cancel: jest.fn().mockResolvedValue(tournament),
      create: jest.fn().mockResolvedValue(tournament),
      findAll: jest.fn().mockResolvedValue([tournament]),
      findOne: jest.fn().mockResolvedValue(tournament),
      getAuditTrail: jest.fn().mockResolvedValue([{ action: 'CREATED' }]),
      publish: jest.fn().mockResolvedValue(tournament),
      remove: jest.fn().mockResolvedValue(undefined),
      transition: jest.fn().mockResolvedValue(tournament),
      update: jest.fn().mockResolvedValue(tournament),
    } as unknown as jest.Mocked<TournamentsService>;
    controller = new TournamentsController(
      new TournamentResponseMapper(),
      service,
    );
  });

  it('creates and maps a tournament', async () => {
    await expect(controller.create(user, { name: 'Rapid' })).resolves.toEqual(
      expect.objectContaining({ id: 'id', name: 'Rapid' }),
    );
    expect(service.create.mock.calls).toContainEqual([
      'auth0|admin',
      { name: 'Rapid' },
    ]);
  });

  it('lists and gets tournaments', async () => {
    await expect(controller.findAll()).resolves.toHaveLength(1);
    await expect(controller.findOne('id')).resolves.toEqual(
      expect.objectContaining({ id: 'id' }),
    );
  });

  it('updates a tournament', async () => {
    await controller.update(user, 'id', { description: 'Updated' });
    expect(service.update.mock.calls).toContainEqual([
      'auth0|admin',
      'id',
      { description: 'Updated' },
    ]);
  });

  it('publishes and transitions a tournament', async () => {
    await controller.publish(user, 'id');
    await controller.transition(user, 'id', {
      status: 'REGISTRATION_CLOSED',
    });
    expect(service.publish.mock.calls).toContainEqual(['auth0|admin', 'id']);
    expect(service.transition.mock.calls).toContainEqual([
      'auth0|admin',
      'id',
      'REGISTRATION_CLOSED',
    ]);
  });

  it('cancels and removes a tournament', async () => {
    await controller.cancel(user, 'id', { reason: 'Venue unavailable' });
    await controller.remove(user, 'id');
    expect(service.cancel.mock.calls).toContainEqual([
      'auth0|admin',
      'id',
      'Venue unavailable',
    ]);
    expect(service.remove.mock.calls).toContainEqual(['auth0|admin', 'id']);
  });

  it('returns audit events and participant metadata', async () => {
    await expect(controller.getAuditTrail('id')).resolves.toEqual([
      { action: 'CREATED' },
    ]);
    await expect(controller.getParticipants('id')).resolves.toEqual({
      participants: [],
      registrationCount: 2,
    });
  });
});

function createTournament(): Tournament {
  return {
    cancellationReason: null,
    createdAt: new Date('2026-07-16T12:00:00.000Z'),
    description: 'Description',
    durationMinutes: 60,
    entryFeeCents: 0,
    id: 'id',
    lichessTournamentId: 'lichess-id',
    name: 'Rapid',
    prizePoolCents: 0,
    refundStatus: 'NONE',
    registrationCount: 2,
    rounds: 5,
    rules: 'Rules',
    startsAt: new Date('2026-08-01T12:00:00.000Z'),
    status: 'DRAFT',
    timeControl: '5+3',
    updatedAt: new Date('2026-07-16T13:00:00.000Z'),
  } as Tournament;
}
