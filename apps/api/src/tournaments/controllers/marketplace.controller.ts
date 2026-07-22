import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import type {
  MarketplaceTournamentResponse,
  TournamentPageResponse,
} from '@checkmatetour/contracts';
import { AuthGuard } from '../../auth/guards';
import { TournamentResponseMapper } from '../mappers';
import { TournamentsService, validateMarketplacePagination } from '../services';

@Controller('tournaments')
@UseGuards(AuthGuard)
export class MarketplaceController {
  constructor(
    private readonly mapper: TournamentResponseMapper,
    private readonly tournamentsService: TournamentsService,
  ) {}

  @Get()
  async findAll(@Query() query: unknown): Promise<TournamentPageResponse> {
    const pagination = validateMarketplacePagination(query);
    const result = await this.tournamentsService.findMarketplacePage(
      pagination.page,
      pagination.pageSize,
    );

    return {
      ...result,
      items: result.items.map((tournament) =>
        this.mapper.toMarketplaceResponse(tournament),
      ),
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MarketplaceTournamentResponse> {
    return this.mapper.toMarketplaceResponse(
      await this.tournamentsService.findMarketplaceTournament(id),
    );
  }
}
