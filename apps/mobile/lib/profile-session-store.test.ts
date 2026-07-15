import {
  clearCachedProfile,
  getCachedProfile,
  setCachedProfile,
} from './profile-session-store';

describe('profile-session-store', () => {
  beforeEach(() => {
    clearCachedProfile();
  });

  it('stores the latest profile response for route guards', () => {
    setCachedProfile({
      country: 'BR',
      dateOfBirth: '1994-12-15',
      displayName: 'Gabriel',
      email: 'gfronzaeng@gmail.com',
      id: 'user-id',
      onboardingCompleted: true,
      roles: ['USER'],
    });

    expect(getCachedProfile()).toEqual({
      country: 'BR',
      dateOfBirth: '1994-12-15',
      displayName: 'Gabriel',
      email: 'gfronzaeng@gmail.com',
      id: 'user-id',
      onboardingCompleted: true,
      roles: ['USER'],
    });
  });

  it('clears stale profile responses', () => {
    setCachedProfile(null);
    clearCachedProfile();

    expect(getCachedProfile()).toBeUndefined();
  });
});
