import { QueryRunner } from 'typeorm';
import { AddUserOnboardingProfile1730000000000 } from './1730000000000-AddUserOnboardingProfile';

describe('AddUserOnboardingProfile1730000000000', () => {
  const migration = new AddUserOnboardingProfile1730000000000();

  it('creates user profiles with a standard id and user_id foreign key', async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    const queryRunner = { query } as unknown as QueryRunner;

    await migration.up(queryRunner);

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE "user_profiles"'),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining(
        '"id" uuid PRIMARY KEY DEFAULT gen_random_uuid()',
      ),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('"user_id" uuid NOT NULL UNIQUE'),
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
