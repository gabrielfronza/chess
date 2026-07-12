import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { HealthService } from './health/health.service';

describe('AppModule', () => {
  it('registers the health module and global configuration', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module.get(HealthService)).toBeInstanceOf(HealthService);

    await module.close();
  });
});
