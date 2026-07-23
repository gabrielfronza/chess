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
    const options = createDataSourceOptions(environment);

    expect(options).toMatchObject({
      type: 'postgres',
      url: environment.DATABASE_URL,
      migrationsTableName: 'typeorm_migrations',
      synchronize: false,
    });
    expect(options.entities).toHaveLength(8);
    expect(options.migrations).toHaveLength(7);
  });

  it('enables Nest entity autoloading without changing migration behavior', () => {
    expect(createTypeOrmModuleOptions(environment)).toMatchObject({
      autoLoadEntities: true,
      migrationsTableName: 'typeorm_migrations',
      synchronize: false,
    });
  });
});
