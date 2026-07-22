import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateTournamentRequest,
  TournamentStatus,
  UpdateTournamentRequest,
} from '@checkmatetour/contracts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/services';
import { Tournament, TournamentAuditEvent } from '../entities';

const allowedTransitions: Partial<
  Record<TournamentStatus, TournamentStatus[]>
> = {
  PUBLISHED: ['REGISTRATION_CLOSED'],
  REGISTRATION_CLOSED: ['RUNNING'],
  RUNNING: ['FINISHED'],
};

const marketplaceStatuses: TournamentStatus[] = [
  'PUBLISHED',
  'REGISTRATION_CLOSED',
  'RUNNING',
  'FINISHED',
];

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentsRepository: Repository<Tournament>,
    @InjectRepository(TournamentAuditEvent)
    private readonly auditRepository: Repository<TournamentAuditEvent>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    actorSubject: string,
    input: CreateTournamentRequest,
  ): Promise<Tournament> {
    const actor = await this.usersService.getAuthenticatedProfile(actorSubject);
    const tournament = this.tournamentsRepository.create({
      cancellationReason: null,
      description: null,
      durationMinutes: null,
      entryFeeCents: 0,
      lichessTournamentId: null,
      prizePoolCents: 0,
      refundStatus: 'NONE',
      registrationCount: 0,
      rounds: null,
      rules: null,
      startsAt: null,
      status: 'DRAFT',
      timeControl: null,
      ...this.toPersistenceFields(input),
    });

    return this.tournamentsRepository.manager.transaction(async (manager) => {
      const saved = await manager.save(Tournament, tournament);
      await manager.save(
        TournamentAuditEvent,
        manager.create(TournamentAuditEvent, {
          action: 'CREATED',
          actorUserId: actor.id,
          details: {},
          tournamentId: saved.id,
        }),
      );

      return saved;
    });
  }

  findAll(): Promise<Tournament[]> {
    return this.tournamentsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findMarketplacePage(page: number, pageSize: number) {
    const [items, total] = await this.tournamentsRepository
      .createQueryBuilder('tournament')
      .where('tournament.status IN (:...statuses)', {
        statuses: marketplaceStatuses,
      })
      .orderBy('tournament.startsAt', 'ASC', 'NULLS LAST')
      .addOrderBy('tournament.id', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      items,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findMarketplaceTournament(id: string): Promise<Tournament> {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id },
    });

    if (!tournament || !marketplaceStatuses.includes(tournament.status)) {
      throw new NotFoundException('Tournament not found');
    }

    return tournament;
  }

  async findOne(id: string): Promise<Tournament> {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    return tournament;
  }

  async update(
    actorSubject: string,
    id: string,
    input: UpdateTournamentRequest,
  ): Promise<Tournament> {
    const actor = await this.usersService.getAuthenticatedProfile(actorSubject);
    const tournament = await this.findOne(id);

    if (!['DRAFT', 'PUBLISHED'].includes(tournament.status)) {
      throw new ConflictException('Tournament can no longer be edited');
    }

    if (
      tournament.registrationCount > 0 &&
      (input.entryFeeCents !== undefined || input.prizePoolCents !== undefined)
    ) {
      throw new ConflictException(
        'Financial fields cannot change after registrations exist',
      );
    }

    Object.assign(tournament, this.toPersistenceFields(input));

    return this.saveWithAudit(tournament, actor.id, 'UPDATED', {
      fields: Object.keys(input),
    });
  }

  async publish(actorSubject: string, id: string): Promise<Tournament> {
    const actor = await this.usersService.getAuthenticatedProfile(actorSubject);
    const tournament = await this.findOne(id);

    if (tournament.status !== 'DRAFT') {
      throw new ConflictException('Only draft tournaments can be published');
    }

    this.assertPublishable(tournament);
    tournament.status = 'PUBLISHED';

    return this.saveWithAudit(tournament, actor.id, 'PUBLISHED');
  }

  async transition(
    actorSubject: string,
    id: string,
    status: TournamentStatus,
  ): Promise<Tournament> {
    const actor = await this.usersService.getAuthenticatedProfile(actorSubject);
    const tournament = await this.findOne(id);

    if (!allowedTransitions[tournament.status]?.includes(status)) {
      throw new ConflictException(
        `Invalid tournament transition from ${tournament.status} to ${status}`,
      );
    }

    tournament.status = status;

    return this.saveWithAudit(tournament, actor.id, 'STATUS_CHANGED', {
      status,
    });
  }

  async cancel(
    actorSubject: string,
    id: string,
    reason: string,
  ): Promise<Tournament> {
    const actor = await this.usersService.getAuthenticatedProfile(actorSubject);
    const tournament = await this.findOne(id);

    if (tournament.status === 'CANCELLED') {
      return tournament;
    }

    if (tournament.status === 'FINISHED') {
      throw new ConflictException('Finished tournaments cannot be cancelled');
    }

    tournament.status = 'CANCELLED';
    tournament.cancellationReason = reason;
    tournament.refundStatus =
      tournament.registrationCount > 0 && tournament.entryFeeCents > 0
        ? 'PENDING'
        : 'NONE';

    return this.saveWithAudit(tournament, actor.id, 'CANCELLED', {
      reason,
      refundStatus: tournament.refundStatus,
    });
  }

  async remove(actorSubject: string, id: string): Promise<void> {
    const actor = await this.usersService.getAuthenticatedProfile(actorSubject);
    const tournament = await this.findOne(id);

    if (tournament.status !== 'DRAFT') {
      throw new ConflictException('Only draft tournaments can be deleted');
    }

    await this.tournamentsRepository.manager.transaction(async (manager) => {
      await manager.save(
        TournamentAuditEvent,
        manager.create(TournamentAuditEvent, {
          action: 'DELETED',
          actorUserId: actor.id,
          details: {},
          tournamentId: tournament.id,
        }),
      );
      await manager.softRemove(Tournament, tournament);
    });
  }

  getAuditTrail(tournamentId: string): Promise<TournamentAuditEvent[]> {
    return this.auditRepository.find({
      order: { createdAt: 'ASC' },
      where: { tournamentId },
    });
  }

  private assertPublishable(tournament: Tournament): void {
    const required = [
      tournament.description,
      tournament.startsAt,
      tournament.durationMinutes,
      tournament.timeControl,
      tournament.rounds,
      tournament.rules,
      tournament.lichessTournamentId,
    ];

    if (required.some((value) => value === null || value === '')) {
      throw new BadRequestException(
        'Published tournaments require schedule, format, rules, and a Lichess tournament ID',
      );
    }
  }

  private async saveWithAudit(
    tournament: Tournament,
    actorUserId: string,
    action: string,
    details: Record<string, unknown> = {},
  ): Promise<Tournament> {
    return this.tournamentsRepository.manager.transaction(async (manager) => {
      const saved = await manager.save(Tournament, tournament);
      await manager.save(
        TournamentAuditEvent,
        manager.create(TournamentAuditEvent, {
          action,
          actorUserId,
          details,
          tournamentId: saved.id,
        }),
      );

      return saved;
    });
  }

  private toPersistenceFields(input: UpdateTournamentRequest) {
    return {
      ...input,
      ...(input.startsAt !== undefined
        ? { startsAt: new Date(input.startsAt) }
        : {}),
    };
  }
}
