import { UsersController } from './users.controller';
import { User } from '../entities';
import { UserResponseMapper } from '../mappers';
import { UsersService } from '../services';

describe('UsersController', () => {
  const authenticatedUser = {
    email: 'player@example.com',
    sub: 'auth0|123',
  };

  it('synchronizes and returns the current profile', async () => {
    const user = createUser();
    const getAuthenticatedProfile = jest.fn().mockResolvedValue(user);
    const syncAuthenticatedUser = jest.fn().mockResolvedValue(createUser());
    const usersService = {
      getAuthenticatedProfile,
      syncAuthenticatedUser,
    } as unknown as UsersService;
    const controller = new UsersController(
      new UserResponseMapper(),
      usersService,
    );

    await expect(controller.getMe(authenticatedUser)).resolves.toMatchObject({
      email: 'player@example.com',
      onboardingCompleted: false,
    });
    expect(syncAuthenticatedUser).toHaveBeenCalledWith(authenticatedUser);
    expect(getAuthenticatedProfile).toHaveBeenCalledWith('auth0|123');
  });

  it('validates and updates onboarding profile fields', async () => {
    const updatedUser = createUser({
      profile: {
        country: 'BR',
        dateOfBirth: '1990-01-02',
        displayName: 'Player One',
      },
    });
    const syncAuthenticatedUser = jest.fn().mockResolvedValue(createUser());
    const updateOnboardingProfile = jest.fn().mockResolvedValue(updatedUser);
    const usersService = {
      syncAuthenticatedUser,
      updateOnboardingProfile,
    } as unknown as UsersService;
    const controller = new UsersController(
      new UserResponseMapper(),
      usersService,
    );

    await expect(
      controller.updateMe(authenticatedUser, {
        country: 'br',
        dateOfBirth: '1990-01-02',
        displayName: ' Player One ',
      }),
    ).resolves.toMatchObject({
      country: 'BR',
      displayName: 'Player One',
      onboardingCompleted: true,
    });
    expect(updateOnboardingProfile).toHaveBeenCalledWith('auth0|123', {
      country: 'BR',
      dateOfBirth: '1990-01-02',
      displayName: 'Player One',
    });
  });
});

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-id',
    email: 'player@example.com',
    profile: null,
    roles: ['USER'],
    ...overrides,
  } as User;
}
