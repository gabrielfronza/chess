import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSecurityModule } from '../auth/auth-security.module';
import { UsersModule } from '../users/users.module';
import { MarketplaceController, TournamentsController } from './controllers';
import { Tournament, TournamentAuditEvent } from './entities';
import { AdminGuard } from './guards';
import { TournamentResponseMapper } from './mappers';
import { TournamentsService } from './services';

@Module({
  controllers: [MarketplaceController, TournamentsController],
  imports: [
    AuthSecurityModule,
    TypeOrmModule.forFeature([Tournament, TournamentAuditEvent]),
    UsersModule,
  ],
  providers: [AdminGuard, TournamentResponseMapper, TournamentsService],
})
export class TournamentsModule {}
