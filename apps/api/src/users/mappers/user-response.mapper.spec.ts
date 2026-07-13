import { User } from '../entities';
import { UserResponseMapper } from './user-response.mapper';

describe('UserResponseMapper', () => {
  it('returns safe user fields without the Auth0 subject', () => {
    const mapper = new UserResponseMapper();

    expect(
      mapper.toResponse({
        id: 'user-id',
        auth0Subject: 'auth0|secret-subject',
        email: 'player@example.com',
        roles: ['USER'],
      } as User),
    ).toEqual({
      id: 'user-id',
      email: 'player@example.com',
      roles: ['USER'],
    });
  });
});
