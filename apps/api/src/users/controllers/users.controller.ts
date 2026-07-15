import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators';
import { AuthGuard } from '../../auth/guards';
import type { AuthenticatedUser } from '../../auth/types';
import { UserResponse, UserResponseMapper } from '../mappers';
import { UsersService, validateUpdateOnboardingProfile } from '../services';

@Controller('me')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly userResponseMapper: UserResponseMapper,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getMe(
    @CurrentUser() authenticatedUser: AuthenticatedUser,
  ): Promise<UserResponse> {
    await this.usersService.syncAuthenticatedUser(authenticatedUser);
    const user = await this.usersService.getAuthenticatedProfile(
      authenticatedUser.sub,
    );

    return this.userResponseMapper.toResponse(user);
  }

  @Patch()
  async updateMe(
    @CurrentUser() authenticatedUser: AuthenticatedUser,
    @Body() body: unknown,
  ): Promise<UserResponse> {
    await this.usersService.syncAuthenticatedUser(authenticatedUser);

    const user = await this.usersService.updateOnboardingProfile(
      authenticatedUser.sub,
      validateUpdateOnboardingProfile(body),
    );

    return this.userResponseMapper.toResponse(user);
  }
}
