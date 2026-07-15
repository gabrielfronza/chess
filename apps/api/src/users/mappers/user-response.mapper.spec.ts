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
        profile: {
          country: 'BR',
          dateOfBirth: '1990-01-02',
          displayName: 'Player One',
        },
        roles: ['USER'],
      } as User),
    ).toEqual({
      id: 'user-id',
      country: 'BR',
      dateOfBirth: '1990-01-02',
      displayName: 'Player One',
      email: 'player@example.com',
      onboardingCompleted: true,
      roles: ['USER'],
    });
  });

  it('marks onboarding incomplete when required profile fields are absent', () => {
    const mapper = new UserResponseMapper();

    expect(
      mapper.toResponse({
        id: 'user-id',
        email: 'player@example.com',
        profile: null,
        roles: ['USER'],
      } as User),
    ).toEqual({
      id: 'user-id',
      country: null,
      dateOfBirth: null,
      displayName: null,
      email: 'player@example.com',
      onboardingCompleted: false,
      roles: ['USER'],
    });
  });
});
