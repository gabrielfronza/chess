import { DataSource } from 'typeorm';
import { createDataSourceOptions } from '../src/database/typeorm-options';

const testDatabaseUrl =
  process.env.DATABASE_TEST_URL ??
  'postgresql://checkmatetour:checkmatetour_local@localhost:54329/checkmatetour_test';

async function resetFoundationMigrationState(
  dataSource: DataSource,
): Promise<void> {
  await dataSource.query(`
    DROP TABLE IF EXISTS
      "wallet_entries",
      "wallets",
      "tournament_audit_events",
      "tournaments",
      "lichess_oauth_states",
      "lichess_accounts",
      "user_profiles",
      "users",
      "schema_migration_checks"
    CASCADE
  `);
  await dataSource.query(
    'DROP FUNCTION IF EXISTS prevent_wallet_entry_mutation()',
  );
  await dataSource.query(`
    CREATE TABLE IF NOT EXISTS "typeorm_migrations" (
      "id" SERIAL NOT NULL,
      "timestamp" bigint NOT NULL,
      "name" character varying NOT NULL,
      CONSTRAINT "PK_typeorm_migrations_id" PRIMARY KEY ("id")
    )
  `);
  await dataSource.query('DELETE FROM "typeorm_migrations"');
}

describe('database migrations', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource(
      createDataSourceOptions({ DATABASE_URL: testDatabaseUrl }),
    );
    await dataSource.initialize();
    await resetFoundationMigrationState(dataSource);
  });

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('applies and reverts all database migrations', async () => {
    await dataSource.runMigrations();

    const appliedRows = await dataSource.query<Array<{ label: string }>>(
      'SELECT "label" FROM "schema_migration_checks"',
    );
    expect(appliedRows).toEqual([{ label: 'story-002-foundation' }]);

    const appliedTables = await dataSource.query<
      Array<{
        userProfilesTable: string | null;
        usersTable: string | null;
        walletEntriesTable: string | null;
        walletsTable: string | null;
      }>
    >(`
      SELECT
        to_regclass('public.user_profiles') AS "userProfilesTable",
        to_regclass('public.users') AS "usersTable",
        to_regclass('public.wallet_entries') AS "walletEntriesTable",
        to_regclass('public.wallets') AS "walletsTable"
    `);
    expect(appliedTables).toEqual([
      {
        userProfilesTable: 'user_profiles',
        usersTable: 'users',
        walletEntriesTable: 'wallet_entries',
        walletsTable: 'wallets',
      },
    ]);

    for (let migration = 0; migration < 7; migration += 1) {
      await dataSource.undoLastMigration();
    }

    const revertedRows = await dataSource.query<
      Array<{
        foundationTable: string | null;
        userProfilesTable: string | null;
        usersTable: string | null;
        walletEntriesTable: string | null;
        walletsTable: string | null;
      }>
    >(`
      SELECT
        to_regclass('public.schema_migration_checks') AS "foundationTable",
        to_regclass('public.user_profiles') AS "userProfilesTable",
        to_regclass('public.users') AS "usersTable",
        to_regclass('public.wallet_entries') AS "walletEntriesTable",
        to_regclass('public.wallets') AS "walletsTable"
    `);
    expect(revertedRows).toEqual([
      {
        foundationTable: null,
        userProfilesTable: null,
        usersTable: null,
        walletEntriesTable: null,
        walletsTable: null,
      },
    ]);
  });
});
