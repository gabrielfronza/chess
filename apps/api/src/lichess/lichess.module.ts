import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSecurityModule } from '../auth/auth-security.module';
import { UsersModule } from '../users/users.module';
import { LichessController } from './controllers';
import { LichessAccount, LichessOAuthState } from './entities';
import { LichessAccountResponseMapper } from './mappers';
import {
  LichessApiClient,
  LichessOAuthStateService,
  LichessService,
  SecretCipherService,
} from './services';

@Module({
  controllers: [LichessController],
  exports: [LichessService],
  imports: [
    AuthSecurityModule,
    TypeOrmModule.forFeature([LichessAccount, LichessOAuthState]),
    UsersModule,
  ],
  providers: [
    LichessAccountResponseMapper,
    LichessApiClient,
    LichessOAuthStateService,
    LichessService,
    SecretCipherService,
  ],
})
export class LichessModule {}
