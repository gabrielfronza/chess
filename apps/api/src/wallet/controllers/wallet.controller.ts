import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type {
  WalletBalanceResponse,
  WalletHistoryPageResponse,
} from '@checkmatetour/contracts';
import { CurrentUser } from '../../auth/decorators';
import { AuthGuard } from '../../auth/guards';
import type { AuthenticatedUser } from '../../auth/types';
import { WalletResponseMapper } from '../mappers';
import { validateWalletHistory, WalletService } from '../services';

@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(
    private readonly mapper: WalletResponseMapper,
    private readonly walletService: WalletService,
  ) {}

  @Get()
  async getBalance(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WalletBalanceResponse> {
    return this.mapper.toBalance(await this.walletService.getBalance(user.sub));
  }

  @Get('entries')
  async getHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: unknown,
  ): Promise<WalletHistoryPageResponse> {
    const pagination = validateWalletHistory(query);
    const result = await this.walletService.getHistory(
      user.sub,
      pagination.page,
      pagination.pageSize,
    );
    return {
      ...result,
      items: result.items.map((entry) => this.mapper.toEntry(entry)),
    };
  }
}
