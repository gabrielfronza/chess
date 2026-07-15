import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { bootstrap, parseAllowedOrigins } from './main';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

jest.mock('./app.module', () => ({
  AppModule: class AppModule {},
}));

describe('bootstrap', () => {
  it('configures the API prefix and listens on the configured port', async () => {
    const getOrThrow = jest.fn().mockReturnValue(4310);
    getOrThrow.mockImplementation((key: string) => {
      if (key === 'CORS_ALLOWED_ORIGINS') {
        return 'http://localhost:8081, http://127.0.0.1:8081';
      }

      return 4310;
    });
    const get = jest.fn().mockReturnValue({ getOrThrow });
    const enableCors = jest.fn();
    const setGlobalPrefix = jest.fn();
    const listen = jest.fn().mockResolvedValue(undefined);
    const app = {
      enableCors,
      get,
      setGlobalPrefix,
      listen,
    };
    const create = jest.spyOn(NestFactory, 'create');

    create.mockResolvedValue(app as never);

    await bootstrap();

    expect(create).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(ConfigService);
    expect(enableCors).toHaveBeenCalledWith({
      credentials: true,
      origin: ['http://localhost:8081', 'http://127.0.0.1:8081'],
    });
    expect(setGlobalPrefix).toHaveBeenCalledWith('api/v1');
    expect(getOrThrow).toHaveBeenCalledWith('PORT');
    expect(listen).toHaveBeenCalledWith(4310);
  });

  it('parses comma-separated CORS origins safely', () => {
    expect(
      parseAllowedOrigins(' http://localhost:8081, ,http://127.0.0.1:8081 '),
    ).toEqual(['http://localhost:8081', 'http://127.0.0.1:8081']);
  });
});
