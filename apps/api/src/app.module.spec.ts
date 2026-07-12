import { Test } from '@nestjs/testing';

process.env.DATABASE_URL =
  'postgresql://chess_app:chess_app_local@localhost:54329/chess_app_test';

import { AppModule } from './app.module';
import { HealthService } from './health/health.service';

jest.mock('./database/database.module', () => ({
  DatabaseModule: class DatabaseModule {},
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
