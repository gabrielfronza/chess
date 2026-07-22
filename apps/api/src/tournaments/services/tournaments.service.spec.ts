import { BadRequestException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/services';
import { Tournament, TournamentAuditEvent } from '../entities';
import { TournamentsService } from './tournaments.service';

describe('TournamentsService', () => {
  function createService(existing: Tournament | null = null) {
    let createdAudit: object | null = null;
    const save = jest.fn(
      (_target: unknown, entity: Tournament | TournamentAuditEvent) =>
        Promise.resolve(entity),
    );
    const transactionalManager = {
      create: jest.fn((_target: unknown, value: object) => {
        createdAudit = value;

        return value;
      }),
      save,
      softRemove: jest.fn().mockResolvedValue(undefined),
    };
    const manager = {
      transaction: jest.fn(
        (operation: (manager: typeof transactionalManager) => unknown) =>
          operation(transactionalManager),
      ),
    };
    const tournamentsRepository = {
      create: jest.fn((value: Partial<Tournament>) => value),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(existing),
      manager,
    };
    const auditRepository = { find: jest.fn().mockResolvedValue([]) };
    const usersService = {
      getAuthenticatedProfile: jest.fn().mockResolvedValue({ id: 'admin-id' }),
    };

    return {
      getCreatedAudit: () => createdAudit,
      getSaveCallCount: () => save.mock.calls.length,
      service: new TournamentsService(
        tournamentsRepository as unknown as Repository<Tournament>,
        auditRepository as unknown as Repository<TournamentAuditEvent>,
        usersService as unknown as UsersService,
      ),
      tournamentsRepository,
    };
  }

  it('creates a draft and audit event', async () => {
    const { getCreatedAudit, service } = createService();

    await expect(
      service.create('auth0|admin', { name: 'Rapid' }),
    ).resolves.toMatchObject({
      name: 'Rapid',
      registrationCount: 0,
      status: 'DRAFT',
    });
    expect(getCreatedAudit()).toMatchObject({
      action: 'CREATED',
      actorUserId: 'admin-id',
    });
  });

  it('requires complete fields before publication', async () => {
    const { service } = createService(createTournament({ status: 'DRAFT' }));

    await expect(service.publish('auth0|admin', 'id')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('publishes a complete draft', async () => {
    const tournament = createTournament({
      description: 'Description',
      durationMinutes: 60,
      lichessTournamentId: 'abc123',
      rounds: 5,
      rules: 'Rules',
      startsAt: new Date('2026-08-01T12:00:00.000Z'),
      status: 'DRAFT',
      timeControl: '5+3',
    });
    const { service } = createService(tournament);

    await expect(service.publish('auth0|admin', 'id')).resolves.toMatchObject({
      status: 'PUBLISHED',
    });
  });

  it('blocks financial edits after registrations', async () => {
    const tournament = createTournament({
      registrationCount: 1,
      status: 'PUBLISHED',
    });
    const { service } = createService(tournament);

    await expect(
      service.update('auth0|admin', 'id', { entryFeeCents: 500 }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('enforces forward state transitions', async () => {
    const tournament = createTournament({ status: 'PUBLISHED' });
    const { service } = createService(tournament);

    await expect(
      service.transition('auth0|admin', 'id', 'RUNNING'),
    ).rejects.toBeInstanceOf(ConflictException);
    await expect(
      service.transition('auth0|admin', 'id', 'REGISTRATION_CLOSED'),
    ).resolves.toMatchObject({ status: 'REGISTRATION_CLOSED' });
  });

  it('prepares one refund operation when cancelling a paid tournament', async () => {
    const tournament = createTournament({
      entryFeeCents: 500,
      registrationCount: 2,
      status: 'PUBLISHED',
    });
    const { getSaveCallCount, service } = createService(tournament);

    await expect(
      service.cancel('auth0|admin', 'id', 'Venue unavailable'),
    ).resolves.toMatchObject({ refundStatus: 'PENDING', status: 'CANCELLED' });
    const saveCalls = getSaveCallCount();

    await service.cancel('auth0|admin', 'id', 'Venue unavailable');

    expect(getSaveCallCount()).toBe(saveCalls);
  });
});

function createTournament(overrides: Partial<Tournament>): Tournament {
  return {
    cancellationReason: null,
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
    ...overrides,
  } as Tournament;
}
