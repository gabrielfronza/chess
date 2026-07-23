import { QueryRunner } from 'typeorm';
import { CreateWalletLedger1770000000000 } from './1770000000000-CreateWalletLedger';

describe('CreateWalletLedger1770000000000', () => {
  it('creates and removes wallet ledger tables', async () => {
    const queryRunner = { query: jest.fn().mockResolvedValue(undefined) };
    const migration = new CreateWalletLedger1770000000000();

    await migration.up(queryRunner as unknown as QueryRunner);
    expect(queryRunner.query).toHaveBeenCalledTimes(6);
    await migration.down(queryRunner as unknown as QueryRunner);
    expect(queryRunner.query).toHaveBeenCalledTimes(10);
  });
});
