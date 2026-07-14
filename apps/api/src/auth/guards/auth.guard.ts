import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../requests';
import { JwtVerifier } from '../providers';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtVerifier: JwtVerifier) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      request.user = await this.jwtVerifier.verify(token);

      return true;
    } catch {
      throw new UnauthorizedException('Invalid bearer token');
    }
  }

  private extractBearerToken(
    authorization: string | string[] | undefined,
  ): string | null {
    if (typeof authorization !== 'string') {
      return null;
    }

    const parts = authorization.split(' ');
    const [scheme, token] = parts;

    if (scheme !== 'Bearer' || !token || parts.length !== 2) {
      return null;
    }

    return token;
  }
}
