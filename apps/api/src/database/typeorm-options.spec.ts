import {
  createDataSourceOptions,
  createTypeOrmModuleOptions,
} from './typeorm-options';

describe('typeorm options', () => {
  const environment = {
    DATABASE_URL:
      'postgresql://chess_app:chess_app_local@localhost:54329/chess_app_dev',
  };

  it('creates shared DataSource options with migrations and synchronization disabled', () => {
    expect(createDataSourceOptions(environment)).toMatchObject({
      type: 'postgres',
      url: environment.DATABASE_URL,
      entities: [],
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
