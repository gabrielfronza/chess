import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthSecurityModule } from './auth-security.module';
import { AuthController } from './controllers';

@Module({
  controllers: [AuthController],
  imports: [AuthSecurityModule, UsersModule],
})
export class AuthModule {}
