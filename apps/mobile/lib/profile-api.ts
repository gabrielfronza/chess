import { createBearerHeaders, httpClient } from './http-client';

export type UserProfileResponse = {
  id: string;
  country: string | null;
  dateOfBirth: string | null;
  displayName: string | null;
  email: string | null;
  onboardingCompleted: boolean;
  roles: Array<'ADMIN' | 'USER'>;
};

export type UpdateOnboardingProfileRequest = {
  country: string;
  dateOfBirth: string;
  displayName: string;
};

export type ProfileApi = {
  getMe(accessToken: string): Promise<UserProfileResponse>;
  updateOnboardingProfile(
    accessToken: string,
    profile: UpdateOnboardingProfileRequest,
  ): Promise<UserProfileResponse>;
};

export const profileApi: ProfileApi = {
  getMe(accessToken: string) {
    return httpClient.get<UserProfileResponse>('/me', {
      headers: createBearerHeaders(accessToken),
    });
  },
  updateOnboardingProfile(
    accessToken: string,
    profile: UpdateOnboardingProfileRequest,
  ) {
    return httpClient.patch<UserProfileResponse>('/me', {
      body: profile,
      headers: createBearerHeaders(accessToken),
    });
  },
};
