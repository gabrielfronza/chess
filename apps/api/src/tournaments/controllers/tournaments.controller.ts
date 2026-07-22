import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { TournamentResponse } from '@checkmatetour/contracts';
import { CurrentUser } from '../../auth/decorators';
import { AuthGuard } from '../../auth/guards';
import type { AuthenticatedUser } from '../../auth/types';
import { AdminGuard } from '../guards';
import { TournamentResponseMapper } from '../mappers';
import {
  TournamentsService,
  validateCancelTournament,
  validateCreateTournament,
  validateTournamentTransition,
  validateUpdateTournament,
} from '../services';

@Controller('admin/tournaments')
@UseGuards(AuthGuard, AdminGuard)
export class TournamentsController {
  constructor(
    private readonly mapper: TournamentResponseMapper,
    private readonly tournamentsService: TournamentsService,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: unknown,
  ): Promise<TournamentResponse> {
    return this.mapper.toResponse(
      await this.tournamentsService.create(
        user.sub,
        validateCreateTournament(body),
      ),
    );
  }

  @Get()
  async findAll(): Promise<TournamentResponse[]> {
    return (await this.tournamentsService.findAll()).map((tournament) =>
      this.mapper.toResponse(tournament),
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TournamentResponse> {
    return this.mapper.toResponse(await this.tournamentsService.findOne(id));
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<TournamentResponse> {
    return this.mapper.toResponse(
      await this.tournamentsService.update(
        user.sub,
        id,
        validateUpdateTournament(body),
      ),
    );
  }

  @Post(':id/publish')
  async publish(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TournamentResponse> {
    return this.mapper.toResponse(
      await this.tournamentsService.publish(user.sub, id),
    );
  }

  @Post(':id/transition')
  async transition(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<TournamentResponse> {
    return this.mapper.toResponse(
      await this.tournamentsService.transition(
        user.sub,
        id,
        validateTournamentTransition(body),
      ),
    );
  }

  @Post(':id/cancel')
  async cancel(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<TournamentResponse> {
    return this.mapper.toResponse(
      await this.tournamentsService.cancel(
        user.sub,
        id,
        validateCancelTournament(body).reason,
      ),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.tournamentsService.remove(user.sub, id);
  }

  @Get(':id/audit')
  getAuditTrail(@Param('id', ParseUUIDPipe) id: string) {
    return this.tournamentsService.getAuditTrail(id);
  }

  @Get(':id/participants')
  async getParticipants(@Param('id', ParseUUIDPipe) id: string) {
    const tournament = await this.tournamentsService.findOne(id);

    return {
      participants: [],
      registrationCount: tournament.registrationCount,
    };
  }
}
