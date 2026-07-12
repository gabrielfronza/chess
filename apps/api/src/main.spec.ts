import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { bootstrap } from './main';

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
    const get = jest.fn().mockReturnValue({ getOrThrow });
    const setGlobalPrefix = jest.fn();
    const listen = jest.fn().mockResolvedValue(undefined);
    const app = {
      get,
      setGlobalPrefix,
      listen,
    };
    const create = jest.spyOn(NestFactory, 'create');

    create.mockResolvedValue(app as never);

    await bootstrap();

    expect(create).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(ConfigService);
    expect(setGlobalPrefix).toHaveBeenCalledWith('api/v1');
    expect(getOrThrow).toHaveBeenCalledWith('PORT');
    expect(listen).toHaveBeenCalledWith(4310);
  });
});
