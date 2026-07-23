import { Test } from '@nestjs/testing';

process.env.DATABASE_URL =
  'postgresql://checkmatetour:checkmatetour_local@localhost:54329/checkmatetour_test';
process.env.AUTH0_DOMAIN = 'example.auth0.com';
process.env.AUTH0_AUDIENCE = 'https://api.chess.local';

import { AppModule } from './app.module';
import { HealthService } from './health/health.service';

jest.mock('./database/database.module', () => ({
  DatabaseModule: class DatabaseModule {},
}));

jest.mock('./auth/auth.module', () => ({
  AuthModule: class AuthModule {},
}));

jest.mock('./lichess/lichess.module', () => ({
  LichessModule: class LichessModule {},
}));

jest.mock('./tournaments/tournaments.module', () => ({
  TournamentsModule: class TournamentsModule {},
}));

jest.mock('./wallet/wallet.module', () => ({
  WalletModule: class WalletModule {},
}));

describe('AppModule', () => {
  it('registers the health module and global configuration', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module.get(HealthService)).toBeInstanceOf(HealthService);

    await module.close();
  });
});
