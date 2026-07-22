import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../auth/requests';
import { UsersService } from '../../users/services';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = await this.usersService.getAuthenticatedProfile(
      request.user.sub,
    );

    if (!user.roles.includes('ADMIN')) {
      throw new ForbiddenException('Administrator access is required');
    }

    return true;
  }
}
