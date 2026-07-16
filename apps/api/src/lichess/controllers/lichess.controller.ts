import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators';
import { AuthGuard } from '../../auth/guards';
import type { AuthenticatedUser } from '../../auth/types';
import {
  LichessAccountResponse,
  LichessAccountResponseMapper,
} from '../mappers';
import { LichessService, validateCompleteLichessOAuth } from '../services';

export type LichessOAuthStartResponse = {
  authorizationUrl: string;
  expiresAt: string;
  state: string;
};

@Controller('lichess')
@UseGuards(AuthGuard)
export class LichessController {
  constructor(
    private readonly lichessAccountResponseMapper: LichessAccountResponseMapper,
    private readonly lichessService: LichessService,
  ) {}

  @Post('oauth/start')
  async startOAuth(
    @CurrentUser() authenticatedUser: AuthenticatedUser,
  ): Promise<LichessOAuthStartResponse> {
    return this.lichessService.startOAuth(authenticatedUser.sub);
  }

  @Post('oauth/complete')
  async completeOAuth(
    @CurrentUser() authenticatedUser: AuthenticatedUser,
    @Body() body: unknown,
  ): Promise<LichessAccountResponse> {
    const account = await this.lichessService.completeOAuth({
      auth0Subject: authenticatedUser.sub,
      ...validateCompleteLichessOAuth(body),
    });

    return this.lichessAccountResponseMapper.toResponse(account);
  }

  @Get('account')
  async getLinkedAccount(
    @CurrentUser() authenticatedUser: AuthenticatedUser,
  ): Promise<LichessAccountResponse> {
    const account = await this.lichessService.getLinkedAccount(
      authenticatedUser.sub,
    );

    return this.lichessAccountResponseMapper.toResponse(account);
  }

  @Delete('account')
  @HttpCode(204)
  async revokeLinkedAccount(
    @CurrentUser() authenticatedUser: AuthenticatedUser,
  ): Promise<void> {
    await this.lichessService.revokeLinkedAccount(authenticatedUser.sub);
  }
}
