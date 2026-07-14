import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { UserResponseMapper } from './mappers';
import { UsersService } from './services';

@Module({
  exports: [UserResponseMapper, UsersService],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserResponseMapper, UsersService],
})
export class UsersModule {}
