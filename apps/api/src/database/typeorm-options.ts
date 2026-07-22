import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { Environment } from '../config/environment';
import { LichessAccount, LichessOAuthState } from '../lichess/entities';
import { User, UserProfile } from '../users/entities';
import { CheckDatabaseFoundation1710000000000 } from './migrations/1710000000000-CheckDatabaseFoundation';
import { CreateUsersForAuth1720000000000 } from './migrations/1720000000000-CreateUsersForAuth';
import { AddUserOnboardingProfile1730000000000 } from './migrations/1730000000000-AddUserOnboardingProfile';
import { CreateLichessOAuthLinking1740000000000 } from './migrations/1740000000000-CreateLichessOAuthLinking';
import { AllowRelinkingRevokedLichessAccounts1750000000000 } from './migrations/1750000000000-AllowRelinkingRevokedLichessAccounts';
import { CreateTournamentAdministration1760000000000 } from './migrations/1760000000000-CreateTournamentAdministration';
import { Tournament, TournamentAuditEvent } from '../tournaments/entities';

const migrations = [
  CheckDatabaseFoundation1710000000000,
  CreateUsersForAuth1720000000000,
  AddUserOnboardingProfile1730000000000,
  CreateLichessOAuthLinking1740000000000,
  AllowRelinkingRevokedLichessAccounts1750000000000,
  CreateTournamentAdministration1760000000000,
];

export function createDataSourceOptions(
  environment: Pick<Environment, 'DATABASE_URL'>,
): DataSourceOptions {
  return {
    type: 'postgres',
    url: environment.DATABASE_URL,
    entities: [
      LichessAccount,
      LichessOAuthState,
      Tournament,
      TournamentAuditEvent,
      User,
      UserProfile,
    ],
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
