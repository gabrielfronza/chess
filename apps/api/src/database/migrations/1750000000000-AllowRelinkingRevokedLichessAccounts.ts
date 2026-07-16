import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowRelinkingRevokedLichessAccounts1750000000000 implements MigrationInterface {
  name = 'AllowRelinkingRevokedLichessAccounts1750000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "lichess_accounts"
        DROP CONSTRAINT "lichess_accounts_user_id_key",
        DROP CONSTRAINT "lichess_accounts_lichess_user_id_key"
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_lichess_accounts_active_user"
        ON "lichess_accounts" ("user_id")
        WHERE "revoked_at" IS NULL
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_lichess_accounts_active_lichess_user"
        ON "lichess_accounts" ("lichess_user_id")
        WHERE "revoked_at" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX "uq_lichess_accounts_active_lichess_user"',
    );
    await queryRunner.query('DROP INDEX "uq_lichess_accounts_active_user"');
    await queryRunner.query(`
      ALTER TABLE "lichess_accounts"
        ADD CONSTRAINT "lichess_accounts_user_id_key" UNIQUE ("user_id"),
        ADD CONSTRAINT "lichess_accounts_lichess_user_id_key" UNIQUE ("lichess_user_id")
    `);
  }
}
