import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { Environment } from '../config/environment';
import { CheckDatabaseFoundation1710000000000 } from './migrations/1710000000000-CheckDatabaseFoundation';

const migrations = [CheckDatabaseFoundation1710000000000];

export function createDataSourceOptions(
  environment: Pick<Environment, 'DATABASE_URL'>,
): DataSourceOptions {
  return {
    type: 'postgres',
    url: environment.DATABASE_URL,
    entities: [],
    migrations,
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
  };
}

export function createTypeOrmModuleOptions(
  environment: Pick<Environment, 'DATABASE_URL'>,
): TypeOrmModuleOptions {
  return {
    ...createDataSourceOptions(environment),
    autoLoadEntities: true,
  };
}
