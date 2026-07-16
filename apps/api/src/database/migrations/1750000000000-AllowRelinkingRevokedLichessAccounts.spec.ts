import { QueryRunner } from 'typeorm';
import { AllowRelinkingRevokedLichessAccounts1750000000000 } from './1750000000000-AllowRelinkingRevokedLichessAccounts';

describe('AllowRelinkingRevokedLichessAccounts1750000000000', () => {
  const migration = new AllowRelinkingRevokedLichessAccounts1750000000000();

  it('only reserves active user and Lichess account links', async () => {
    const query = jest.fn().mockResolvedValue(undefined);

    await migration.up({ query } as unknown as QueryRunner);

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('DROP CONSTRAINT "lichess_accounts_user_id_key"'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('"uq_lichess_accounts_active_user"'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('"uq_lichess_accounts_active_lichess_user"'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE "revoked_at" IS NULL'),
    );
  });

  it('restores permanent uniqueness on rollback', async () => {
    const query = jest.fn().mockResolvedValue(undefined);

    await migration.down({ query } as unknown as QueryRunner);

    expect(query).toHaveBeenLastCalledWith(
      expect.stringContaining('UNIQUE ("lichess_user_id")'),
    );
  });
});
