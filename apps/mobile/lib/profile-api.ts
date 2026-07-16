import type {
  UpdateOnboardingProfileRequest,
  UserProfileResponse,
} from '@checkmatetour/contracts';
import { createBearerHeaders, httpClient } from './http-client';

export type {
  UpdateOnboardingProfileRequest,
  UserProfileResponse,
} from '@checkmatetour/contracts';

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
