import { Injectable } from '@nestjs/common';
import type { UserProfileResponse } from '@checkmatetour/contracts';
import { User } from '../entities';

@Injectable()
export class UserResponseMapper {
  public toResponse(user: User): UserProfileResponse {
    const profile = user.profile;

    return {
      id: user.id,
      country: profile?.country ?? null,
      dateOfBirth: profile?.dateOfBirth ?? null,
      displayName: profile?.displayName ?? null,
      email: user.email,
      onboardingCompleted: this.isOnboardingCompleted(user),
      roles: user.roles,
    };
  }

  private isOnboardingCompleted(user: User): boolean {
    const profile = user.profile;

    return Boolean(
      profile?.country && profile.dateOfBirth && profile.displayName,
    );
  }
}
