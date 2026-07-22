import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
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
      createQueryBuilder: jest.fn(),
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

  it('returns a stable paginated marketplace page', async () => {
    const published = createTournament({ status: 'PUBLISHED' });
    const queryBuilder = createQueryBuilder([[published], 21]);
    const { service, tournamentsRepository } = createService();
    tournamentsRepository.createQueryBuilder.mockReturnValue(queryBuilder);

    await expect(service.findMarketplacePage(2, 20)).resolves.toEqual({
      items: [published],
      page: 2,
      pageSize: 20,
      total: 21,
      totalPages: 2,
    });
    expect(queryBuilder.skip).toHaveBeenCalledWith(20);
    expect(queryBuilder.take).toHaveBeenCalledWith(20);
    expect(queryBuilder.addOrderBy).toHaveBeenCalledWith(
      'tournament.id',
      'ASC',
    );
  });

  it('hides drafts from marketplace details', async () => {
    const { service } = createService(createTournament({ status: 'DRAFT' }));

    await expect(
      service.findMarketplaceTournament('id'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns a previously published tournament in marketplace details', async () => {
    const tournament = createTournament({ status: 'RUNNING' });
    const { service } = createService(tournament);

    await expect(service.findMarketplaceTournament('id')).resolves.toBe(
      tournament,
    );
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

function createQueryBuilder(result: [Tournament[], number]) {
  const queryBuilder = {
    addOrderBy: jest.fn(),
    getManyAndCount: jest.fn().mockResolvedValue(result),
    orderBy: jest.fn(),
    skip: jest.fn(),
    take: jest.fn(),
    where: jest.fn(),
  };

  Object.values(queryBuilder).forEach((method) => {
    if (method !== queryBuilder.getManyAndCount)
      method.mockReturnValue(queryBuilder);
  });

  return queryBuilder;
}
