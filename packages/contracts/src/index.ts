export type UserRole = "ADMIN" | "USER";

export type UserProfileResponse = {
  id: string;
  country: string | null;
  dateOfBirth: string | null;
  displayName: string | null;
  email: string | null;
  onboardingCompleted: boolean;
  roles: UserRole[];
};

export type UpdateOnboardingProfileRequest = {
  country: string;
  dateOfBirth: string;
  displayName: string;
};

export type LichessOAuthStartResponse = {
  authorizationUrl: string;
  expiresAt: string;
  state: string;
};

export type CompleteLichessOAuthRequest = {
  code: string;
  state: string;
};

export type LichessAccountResponse = {
  id: string;
  linkedAt: string;
  lichessUserId: string;
  revokedAt: string | null;
  username: string;
};
