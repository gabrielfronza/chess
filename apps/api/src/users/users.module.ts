import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSecurityModule } from '../auth/auth-security.module';
import { UsersController } from './controllers';
import { User, UserProfile } from './entities';
import { UserResponseMapper } from './mappers';
import { UsersService } from './services';

@Module({
  controllers: [UsersController],
  exports: [UserResponseMapper, UsersService],
  imports: [AuthSecurityModule, TypeOrmModule.forFeature([User, UserProfile])],
  providers: [UserResponseMapper, UsersService],
})
export class UsersModule {}
