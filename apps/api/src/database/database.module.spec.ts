import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from '../config/environment';
import { DatabaseModule } from './database.module';

type TypeOrmRegistration = {
  inject: unknown[];
  useFactory: (config: ConfigService<Environment, true>) => unknown;
};

type TypeOrmModuleMock = {
  forRootAsync: jest.Mock<unknown, [TypeOrmRegistration]>;
};

jest.mock('@nestjs/typeorm', () => ({
  TypeOrmModule: {
    forRootAsync: jest.fn(() => class TypeOrmRootModule {}),
  },
}));

describe('DatabaseModule', () => {
  const typeOrmModuleMock = TypeOrmModule as unknown as TypeOrmModuleMock;

  it('registers TypeORM with validated configuration', () => {
    expect(DatabaseModule).toBeDefined();

    const registration = typeOrmModuleMock.forRootAsync.mock.calls[0][0];

    expect(registration.inject).toEqual([ConfigService]);
    expect(typeof registration.useFactory).toBe('function');
  });

  it('builds TypeORM options from ConfigService', () => {
    const registration = typeOrmModuleMock.forRootAsync.mock.calls[0][0];
    const get = jest
      .fn()
      .mockReturnValue(
        'postgresql://chess_app:chess_app_local@localhost:54329/chess_app_dev',
      );
    const config = {
      get,
    } as unknown as ConfigService<Environment, true>;

    expect(registration.useFactory(config)).toMatchObject({
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: false,
    });
    expect(get).toHaveBeenCalledWith('DATABASE_URL', { infer: true });
  });
});
