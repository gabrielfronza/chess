import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');

  await app.listen(config.getOrThrow<number>('PORT'));
}

/* istanbul ignore next -- process entrypoint; bootstrap is tested directly. */
if (require.main === module) {
  void bootstrap();
}
