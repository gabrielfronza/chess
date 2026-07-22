import { ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { UsersService } from '../../users/services';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  it('allows administrators', async () => {
    const guard = createGuard(['ADMIN']);

    await expect(guard.canActivate(createContext())).resolves.toBe(true);
  });

  it('rejects non-administrators', async () => {
    const guard = createGuard(['USER']);

    await expect(guard.canActivate(createContext())).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});

function createGuard(roles: Array<'ADMIN' | 'USER'>): AdminGuard {
  return new AdminGuard({
    getAuthenticatedProfile: jest.fn().mockResolvedValue({ roles }),
  } as unknown as UsersService);
}

function createContext(): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user: { sub: 'auth0|admin' } }),
    }),
  } as unknown as ExecutionContext;
}
