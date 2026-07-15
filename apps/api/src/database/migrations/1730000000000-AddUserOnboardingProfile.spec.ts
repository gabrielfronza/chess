import { QueryRunner } from 'typeorm';
import { AddUserOnboardingProfile1730000000000 } from './1730000000000-AddUserOnboardingProfile';

describe('AddUserOnboardingProfile1730000000000', () => {
  const migration = new AddUserOnboardingProfile1730000000000();

  it('creates user profiles with user_id as primary and foreign key', async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    const queryRunner = { query } as unknown as QueryRunner;

    await migration.up(queryRunner);

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE "user_profiles"'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('"user_id" uuid PRIMARY KEY'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('FOREIGN KEY ("user_id")'),
    );
  });

  it('drops user profiles on rollback', async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    const queryRunner = { query } as unknown as QueryRunner;

    await migration.down(queryRunner);

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('DROP TABLE "user_profiles"'),
    );
  });
});
