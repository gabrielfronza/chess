import { Controller, Get, UseGuards } from '@nestjs/common';
import type { UserProfileResponse } from '@checkmatetour/contracts';
import { CurrentUser } from '../decorators';
import { AuthGuard } from '../guards';
import type { AuthenticatedUser } from '../types';
import { UserResponseMapper } from '../../users/mappers';
import { UsersService } from '../../users/services';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userResponseMapper: UserResponseMapper,
    private readonly usersService: UsersService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(
    @CurrentUser() authenticatedUser: AuthenticatedUser,
  ): Promise<UserProfileResponse> {
    const user =
      await this.usersService.syncAuthenticatedUser(authenticatedUser);

    return this.userResponseMapper.toResponse(user);
  }
}
