import { DataSource } from 'typeorm';
import { createDataSourceOptions } from '../src/database/typeorm-options';

const testDatabaseUrl =
  process.env.DATABASE_TEST_URL ??
  'postgresql://chess_app:chess_app_local@localhost:54329/chess_app_test';

async function resetFoundationMigrationState(
  dataSource: DataSource,
): Promise<void> {
  await dataSource.query('DROP TABLE IF EXISTS "schema_migration_checks"');
  await dataSource.query(`
    CREATE TABLE IF NOT EXISTS "typeorm_migrations" (
      "id" SERIAL NOT NULL,
      "timestamp" bigint NOT NULL,
      "name" character varying NOT NULL,
      CONSTRAINT "PK_typeorm_migrations_id" PRIMARY KEY ("id")
    )
  `);
  await dataSource.query('DELETE FROM "typeorm_migrations" WHERE "name" = $1', [
    'CheckDatabaseFoundation1710000000000',
  ]);
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

  it('applies and reverts the foundation migration', async () => {
    await dataSource.runMigrations();

    const appliedRows = await dataSource.query<Array<{ label: string }>>(
      'SELECT "label" FROM "schema_migration_checks"',
    );
    expect(appliedRows).toEqual([{ label: 'story-002-foundation' }]);

    await dataSource.undoLastMigration();

    const revertedRows = await dataSource.query<
      Array<{ tableName: string | null }>
    >(`
      SELECT to_regclass('public.schema_migration_checks') AS "tableName"
    `);
    expect(revertedRows).toEqual([{ tableName: null }]);
  });
});
