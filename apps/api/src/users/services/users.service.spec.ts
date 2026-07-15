import { Repository } from 'typeorm';
import { AuthenticatedUser } from '../../auth/types';
import { User, UserProfile } from '../entities';
import { UsersService } from './users.service';

describe('UsersService', () => {
  function createService(existingUser: User | null = null): {
    profilesRepository: jest.Mocked<
      Pick<Repository<UserProfile>, 'create' | 'save'>
    >;
    repository: jest.Mocked<
      Pick<Repository<User>, 'create' | 'findOne' | 'save'>
    >;
    service: UsersService;
  } {
    const repository = {
      create: jest.fn((user: Partial<User>) => user as User),
      findOne: jest.fn().mockResolvedValue(existingUser),
      save: jest.fn((user: User) => Promise.resolve(user)),
    };
    const profilesRepository = {
      create: jest.fn(
        (profile: Partial<UserProfile>) => profile as UserProfile,
      ),
      save: jest.fn((profile: UserProfile) => Promise.resolve(profile)),
    };

    return {
      profilesRepository,
      repository,
      service: new UsersService(
        repository as unknown as Repository<User>,
        profilesRepository as unknown as Repository<UserProfile>,
      ),
    };
  }

  const authenticatedUser: AuthenticatedUser = {
    sub: 'auth0|abc',
    email: 'player@example.com',
  };

  it('creates a user exactly once for a first login', async () => {
    const { repository, service } = createService();

    await expect(
      service.syncAuthenticatedUser(authenticatedUser),
    ).resolves.toEqual({
      auth0Subject: 'auth0|abc',
      email: 'player@example.com',
      roles: ['USER'],
    });

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { auth0Subject: 'auth0|abc' },
    });
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('updates only permitted profile fields on subsequent login', async () => {
    const existingUser = {
      auth0Subject: 'auth0|abc',
      email: 'old@example.com',
      roles: ['ADMIN'],
    } as User;
    const { repository, service } = createService(existingUser);

    await service.syncAuthenticatedUser(authenticatedUser);

    expect(repository.create).not.toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalledWith({
      auth0Subject: 'auth0|abc',
      email: 'player@example.com',
      roles: ['ADMIN'],
    });
  });

  it('does not overwrite existing fields with absent optional claims', async () => {
    const existingUser = {
      auth0Subject: 'auth0|abc',
      email: 'existing@example.com',
      roles: ['USER'],
    } as User;
    const { repository, service } = createService(existingUser);

    await service.syncAuthenticatedUser({ sub: 'auth0|abc' });

    expect(repository.save).toHaveBeenCalledWith(existingUser);
  });

  it('returns the authenticated profile by Auth0 subject', async () => {
    const existingUser = {
      auth0Subject: 'auth0|abc',
      roles: ['USER'],
    } as User;
    const { repository, service } = createService(existingUser);

    await expect(service.getAuthenticatedProfile('auth0|abc')).resolves.toBe(
      existingUser,
    );
    expect(repository.findOne).toHaveBeenCalledWith({
      relations: { profile: true },
      where: { auth0Subject: 'auth0|abc' },
    });
  });

  it('updates onboarding-owned profile fields', async () => {
    const existingUser = {
      auth0Subject: 'auth0|abc',
      email: 'player@example.com',
      id: 'user-id',
      roles: ['USER'],
    } as User;
    const { profilesRepository, repository, service } =
      createService(existingUser);

    await expect(
      service.updateOnboardingProfile('auth0|abc', {
        country: 'BR',
        dateOfBirth: '1990-01-02',
        displayName: 'Player One',
      }),
    ).resolves.toEqual({
      ...existingUser,
      profile: {
        country: 'BR',
        dateOfBirth: '1990-01-02',
        displayName: 'Player One',
        user: existingUser,
        userId: 'user-id',
      },
    });

    expect(repository.findOne).toHaveBeenCalledWith({
      relations: { profile: true },
      where: { auth0Subject: 'auth0|abc' },
    });
    expect(profilesRepository.create).toHaveBeenCalledTimes(1);
    expect(profilesRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        country: 'BR',
        dateOfBirth: '1990-01-02',
        displayName: 'Player One',
        user: existingUser,
        userId: 'user-id',
      }),
    );
  });

  it('updates the existing profile row when one already exists', async () => {
    const existingProfile = {
      userId: 'user-id',
    } as UserProfile;
    const existingUser = {
      auth0Subject: 'auth0|abc',
      email: 'player@example.com',
      id: 'user-id',
      profile: existingProfile,
      roles: ['USER'],
    } as User;
    const { profilesRepository, service } = createService(existingUser);

    await service.updateOnboardingProfile('auth0|abc', {
      country: 'BR',
      dateOfBirth: '1990-01-02',
      displayName: 'Player One',
    });

    expect(profilesRepository.create).not.toHaveBeenCalled();
    expect(profilesRepository.save).toHaveBeenCalledWith({
      country: 'BR',
      dateOfBirth: '1990-01-02',
      displayName: 'Player One',
      userId: 'user-id',
    });
  });

  it('rejects profile access when the authenticated user was not synchronized', async () => {
    const { service } = createService();

    await expect(
      service.getAuthenticatedProfile('auth0|missing'),
    ).rejects.toThrow('Authenticated user was not synchronized');
  });
});
