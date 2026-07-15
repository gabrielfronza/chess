import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticatedUser } from '../../auth/types';
import { User, UserProfile } from '../entities';
import { UpdateOnboardingProfileInput } from './onboarding-profile.validation';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfilesRepository: Repository<UserProfile>,
  ) {}

  async syncAuthenticatedUser(
    authenticatedUser: AuthenticatedUser,
  ): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { auth0Subject: authenticatedUser.sub },
    });

    if (!existingUser) {
      return this.usersRepository.save(
        this.usersRepository.create({
          auth0Subject: authenticatedUser.sub,
          email: authenticatedUser.email ?? null,
          roles: ['USER'],
        }),
      );
    }

    existingUser.email = authenticatedUser.email ?? existingUser.email;

    return this.usersRepository.save(existingUser);
  }

  async getAuthenticatedProfile(auth0Subject: string): Promise<User> {
    return this.findByAuth0Subject(auth0Subject);
  }

  async updateOnboardingProfile(
    auth0Subject: string,
    profile: UpdateOnboardingProfileInput,
  ): Promise<User> {
    const user = await this.findByAuth0Subject(auth0Subject);

    const userProfile =
      user.profile ??
      this.userProfilesRepository.create({
        user,
        userId: user.id,
      });

    userProfile.country = profile.country;
    userProfile.dateOfBirth = profile.dateOfBirth;
    userProfile.displayName = profile.displayName;

    user.profile = await this.userProfilesRepository.save(userProfile);

    return user;
  }

  private async findByAuth0Subject(auth0Subject: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      relations: { profile: true },
      where: { auth0Subject },
    });

    if (!user) {
      throw new Error('Authenticated user was not synchronized');
    }

    return user;
  }
}
