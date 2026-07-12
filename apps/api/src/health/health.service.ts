import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthResponseDto } from './health-response.dto';

@Injectable()
export class HealthService {
  constructor(private readonly config: ConfigService) {}

  getHealth(): HealthResponseDto {
    return {
      status: 'ok',
      version: this.config.getOrThrow<string>('APP_VERSION'),
      timestamp: new Date().toISOString(),
    };
  }
}
