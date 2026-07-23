import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { AdminWalletAdjustmentResponse } from '@checkmatetour/contracts';
import { CurrentUser } from '../../auth/decorators';
import { AuthGuard } from '../../auth/guards';
import type { AuthenticatedUser } from '../../auth/types';
import { AdminGuard } from '../../tournaments/guards';
import { WalletResponseMapper } from '../mappers';
import { validateWalletAdjustment, WalletService } from '../services';

@Controller('admin/wallets')
@UseGuards(AuthGuard, AdminGuard)
export class AdminWalletController {
  constructor(
    private readonly mapper: WalletResponseMapper,
    private readonly walletService: WalletService,
  ) {}

  @Post(':userId/adjustments')
  async adjust(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: unknown,
  ): Promise<AdminWalletAdjustmentResponse> {
    const input = validateWalletAdjustment(body);
    const result = await this.walletService.adjust(actor.sub, userId, input);
    return {
      balance: this.mapper.toBalance(result.wallet),
      entry: this.mapper.toEntry(result.entry),
    };
  }
}
