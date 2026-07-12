import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthResponse } from './health-response';

@Injectable()
export class HealthService {
  constructor(private readonly config: ConfigService) {}

  getHealth(): HealthResponse {
    return {
      status: 'ok',
      version: this.config.getOrThrow<string>('APP_VERSION'),
      timestamp: new Date().toISOString(),
    };
  }
}
