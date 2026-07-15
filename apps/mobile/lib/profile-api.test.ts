import { httpClient } from './http-client';
import { profileApi } from './profile-api';

jest.mock('./http-client', () => ({
  createBearerHeaders: (accessToken: string) => ({
    Authorization: `Bearer ${accessToken}`,
  }),
  httpClient: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

describe('profileApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads the current profile with a bearer token', async () => {
    (httpClient.get as jest.Mock).mockResolvedValue({ id: 'user-id' });

    await expect(profileApi.getMe('access-token')).resolves.toEqual({
      id: 'user-id',
    });
    expect(httpClient.get).toHaveBeenCalledWith('/me', {
      headers: { Authorization: 'Bearer access-token' },
    });
  });

  it('updates onboarding profile fields with a bearer token', async () => {
    const profile = {
      country: 'BR',
      dateOfBirth: '1990-01-02',
      displayName: 'Player One',
    } as const;
    (httpClient.patch as jest.Mock).mockResolvedValue({
      onboardingCompleted: true,
    });

    await expect(
      profileApi.updateOnboardingProfile('access-token', profile),
    ).resolves.toEqual({ onboardingCompleted: true });
    expect(httpClient.patch).toHaveBeenCalledWith('/me', {
      body: profile,
      headers: { Authorization: 'Bearer access-token' },
    });
  });
});
