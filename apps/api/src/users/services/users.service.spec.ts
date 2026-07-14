import { Repository } from 'typeorm';
import { AuthenticatedUser } from '../../auth/types';
import { User } from '../entities';
import { UsersService } from './users.service';

describe('UsersService', () => {
  function createService(existingUser: User | null = null): {
    repository: jest.Mocked<
      Pick<Repository<User>, 'create' | 'findOneBy' | 'save'>
    >;
    service: UsersService;
  } {
    const repository = {
      create: jest.fn((user: Partial<User>) => user as User),
      findOneBy: jest.fn().mockResolvedValue(existingUser),
      save: jest.fn((user: User) => Promise.resolve(user)),
    };

    return {
      repository,
      service: new UsersService(repository as unknown as Repository<User>),
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

    expect(repository.findOneBy).toHaveBeenCalledWith({
      auth0Subject: 'auth0|abc',
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
});
