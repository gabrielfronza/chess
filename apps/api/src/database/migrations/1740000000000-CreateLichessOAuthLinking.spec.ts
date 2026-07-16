import { QueryRunner } from 'typeorm';
import { CreateLichessOAuthLinking1740000000000 } from './1740000000000-CreateLichessOAuthLinking';

describe('CreateLichessOAuthLinking1740000000000', () => {
  const migration = new CreateLichessOAuthLinking1740000000000();

  it('creates Lichess accounts and OAuth states with one-to-one constraints', async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    const queryRunner = { query } as unknown as QueryRunner;

    await migration.up(queryRunner);

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE "lichess_accounts"'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('"user_id" uuid NOT NULL UNIQUE'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('"lichess_user_id" varchar(80) NOT NULL UNIQUE'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE "lichess_oauth_states"'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('"state_hash" varchar(128) NOT NULL UNIQUE'),
    );
  });

  it('drops Lichess linking tables on rollback', async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    const queryRunner = { query } as unknown as QueryRunner;

    await migration.down(queryRunner);

    expect(query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('DROP TABLE "lichess_oauth_states"'),
    );
    expect(query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('DROP TABLE "lichess_accounts"'),
    );
  });
});
