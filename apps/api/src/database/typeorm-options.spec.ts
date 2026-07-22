import {
  createDataSourceOptions,
  createTypeOrmModuleOptions,
} from './typeorm-options';

describe('typeorm options', () => {
  const environment = {
    DATABASE_URL:
      'postgresql://checkmatetour:checkmatetour_local@localhost:54329/checkmatetour_dev',
  };

  it('creates shared DataSource options with migrations and synchronization disabled', () => {
    expect(createDataSourceOptions(environment)).toMatchObject({
      type: 'postgres',
      url: environment.DATABASE_URL,
      entities: [
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
      ],
      migrations: [
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
      ],
      migrationsTableName: 'typeorm_migrations',
      synchronize: false,
    });
  });

  it('enables Nest entity autoloading without changing migration behavior', () => {
    expect(createTypeOrmModuleOptions(environment)).toMatchObject({
      autoLoadEntities: true,
      migrationsTableName: 'typeorm_migrations',
      synchronize: false,
    });
  });
});
