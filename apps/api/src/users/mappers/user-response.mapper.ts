import { Injectable } from '@nestjs/common';
import { UserRole } from '../types';
import { User } from '../entities';

export type UserResponse = {
  id: string;
  email: string | null;
  roles: UserRole[];
};

@Injectable()
export class UserResponseMapper {
  public toResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
  }
}
