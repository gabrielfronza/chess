import type { HealthResponse } from './health-response';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  it('returns the health service response', () => {
    const response: HealthResponse = {
      status: 'ok',
      version: '1.2.3',
      timestamp: '2026-07-12T18:00:00.000Z',
    };
    const healthService = {
      getHealth: jest.fn().mockReturnValue(response),
    };
    const controller = new HealthController(healthService as HealthService);

    expect(controller.getHealth()).toBe(response);
    expect(healthService.getHealth).toHaveBeenCalledTimes(1);
  });
});
