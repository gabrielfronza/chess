import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { Environment } from '../config/environment';
import { User } from '../users/entities';
import { CheckDatabaseFoundation1710000000000 } from './migrations/1710000000000-CheckDatabaseFoundation';
import { CreateUsersForAuth1720000000000 } from './migrations/1720000000000-CreateUsersForAuth';

const migrations = [
  CheckDatabaseFoundation1710000000000,
  CreateUsersForAuth1720000000000,
];

export function createDataSourceOptions(
  environment: Pick<Environment, 'DATABASE_URL'>,
): DataSourceOptions {
  return {
    type: 'postgres',
    url: environment.DATABASE_URL,
    entities: [User],
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
