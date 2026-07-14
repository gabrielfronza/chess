import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers';
import { AuthGuard } from './guards';
import { JwtVerifier } from './providers';

@Module({
  controllers: [AuthController],
  imports: [UsersModule],
  providers: [AuthGuard, JwtVerifier],
})
export class AuthModule {}
