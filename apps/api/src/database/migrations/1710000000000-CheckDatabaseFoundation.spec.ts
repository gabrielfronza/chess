import { QueryRunner } from 'typeorm';
import { CheckDatabaseFoundation1710000000000 } from './1710000000000-CheckDatabaseFoundation';

describe('CheckDatabaseFoundation1710000000000', () => {
  const migration = new CheckDatabaseFoundation1710000000000();

  it('creates the foundation migration check table and row', async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    const queryRunner = { query } as unknown as QueryRunner;

    await migration.up(queryRunner);

    expect(query).toHaveBeenCalledTimes(2);
    expect(query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('CREATE TABLE "schema_migration_checks"'),
    );
    expect(query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("VALUES ('story-002-foundation')"),
    );
  });

  it('drops the foundation migration check table on rollback', async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    const queryRunner = { query } as unknown as QueryRunner;

    await migration.down(queryRunner);

    expect(query).toHaveBeenCalledWith('DROP TABLE "schema_migration_checks"');
  });
});
