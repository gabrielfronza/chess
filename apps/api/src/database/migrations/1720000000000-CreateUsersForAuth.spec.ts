import { QueryRunner } from 'typeorm';
import { CreateUsersForAuth1720000000000 } from './1720000000000-CreateUsersForAuth';

describe('CreateUsersForAuth1720000000000', () => {
  const migration = new CreateUsersForAuth1720000000000();

  it('creates the users table for Auth0-owned identities', async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    const queryRunner = { query } as unknown as QueryRunner;

    await migration.up(queryRunner);

    expect(query).toHaveBeenCalledWith(
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto"',
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE "users"'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('"auth0_subject" varchar(255) NOT NULL UNIQUE'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('"roles" text[] NOT NULL DEFAULT'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('"deleted_at" timestamptz'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('CREATE INDEX "idx_users_email"'),
    );
  });

  it('drops story-owned database objects on rollback', async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    const queryRunner = { query } as unknown as QueryRunner;

    await migration.down(queryRunner);

    expect(query).toHaveBeenNthCalledWith(1, 'DROP INDEX "idx_users_email"');
    expect(query).toHaveBeenNthCalledWith(2, 'DROP TABLE "users"');
  });
});
