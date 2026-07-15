import { AuthController } from './auth.controller';
import { UsersService } from '../../users/services';
import { User } from '../../users/entities';
import { UserResponseMapper } from '../../users/mappers';

describe('AuthController', () => {
  it('synchronizes and returns the authenticated user', async () => {
    const user = {
      id: 'user-id',
      email: 'player@example.com',
      profile: null,
      roles: ['USER'],
    } as User;
    const syncAuthenticatedUser = jest.fn().mockResolvedValue(user);
    const usersService = {
      syncAuthenticatedUser,
    } as unknown as UsersService;
    const userResponseMapper = new UserResponseMapper();
    const controller = new AuthController(userResponseMapper, usersService);
    const authenticatedUser = { sub: 'auth0|123' };

    await expect(controller.getMe(authenticatedUser)).resolves.toEqual({
      id: 'user-id',
      country: null,
      dateOfBirth: null,
      displayName: null,
      email: 'player@example.com',
      onboardingCompleted: false,
      roles: ['USER'],
    });
    expect(syncAuthenticatedUser).toHaveBeenCalledWith(authenticatedUser);
  });
});
