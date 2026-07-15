import { Injectable } from '@nestjs/common';
import { User } from '../entities';
import { UserRole } from '../types';

export type UserResponse = {
  id: string;
  country: string | null;
  dateOfBirth: string | null;
  displayName: string | null;
  email: string | null;
  onboardingCompleted: boolean;
  roles: UserRole[];
};

@Injectable()
export class UserResponseMapper {
  public toResponse(user: User): UserResponse {
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
