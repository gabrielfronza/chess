import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSecurityModule } from '../auth/auth-security.module';
import { AdminGuard } from '../tournaments/guards';
import { UsersModule } from '../users/users.module';
import { AdminWalletController, WalletController } from './controllers';
import { Wallet, WalletEntry } from './entities';
import { WalletResponseMapper } from './mappers';
import { WalletService } from './services';

@Module({
  controllers: [AdminWalletController, WalletController],
  imports: [
    AuthSecurityModule,
    TypeOrmModule.forFeature([Wallet, WalletEntry]),
    UsersModule,
  ],
  providers: [AdminGuard, WalletResponseMapper, WalletService],
})
export class WalletModule {}
