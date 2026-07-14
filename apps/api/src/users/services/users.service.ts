import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticatedUser } from '../../auth/types';
import { User } from '../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async syncAuthenticatedUser(
    authenticatedUser: AuthenticatedUser,
  ): Promise<User> {
    const existingUser = await this.usersRepository.findOneBy({
      auth0Subject: authenticatedUser.sub,
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
}
