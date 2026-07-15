import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors({
    credentials: true,
    origin: parseAllowedOrigins(
      config.getOrThrow<string>('CORS_ALLOWED_ORIGINS'),
    ),
  });
  app.setGlobalPrefix('api/v1');

  await app.listen(config.getOrThrow<number>('PORT'));
}

export function parseAllowedOrigins(value: string): string[] {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/* istanbul ignore next -- process entrypoint; bootstrap is tested directly. */
if (require.main === module) {
  void bootstrap();
}
