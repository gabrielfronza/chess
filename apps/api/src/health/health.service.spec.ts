import { ConfigService } from '@nestjs/config';
import { HealthService } from './health.service';

describe('HealthService', () => {
  it('returns status, version, and a UTC timestamp', () => {
    const config = new ConfigService({ APP_VERSION: '1.2.3' });
    const service = new HealthService(config);

    const result = service.getHealth();

    expect(result.status).toBe('ok');
    expect(result.version).toBe('1.2.3');
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
  });
});
