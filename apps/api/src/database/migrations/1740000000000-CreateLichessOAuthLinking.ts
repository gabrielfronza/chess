import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLichessOAuthLinking1740000000000 implements MigrationInterface {
  name = 'CreateLichessOAuthLinking1740000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "lichess_accounts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL UNIQUE,
        "lichess_user_id" varchar(80) NOT NULL UNIQUE,
        "username" varchar(80) NOT NULL,
        "access_token_ciphertext" text NOT NULL,
        "access_token_iv" varchar(32) NOT NULL,
        "access_token_auth_tag" varchar(32) NOT NULL,
        "scopes" text[] NOT NULL DEFAULT ARRAY[]::text[],
        "token_expires_at" timestamptz,
        "revoked_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "fk_lichess_accounts_user_id"
          FOREIGN KEY ("user_id")
          REFERENCES "users" ("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "lichess_oauth_states" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "state_hash" varchar(128) NOT NULL UNIQUE,
        "code_verifier" varchar(512) NOT NULL,
        "redirect_uri" text NOT NULL,
        "expires_at" timestamptz NOT NULL,
        "consumed_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "fk_lichess_oauth_states_user_id"
          FOREIGN KEY ("user_id")
          REFERENCES "users" ("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      'CREATE INDEX "idx_lichess_oauth_states_user_id" ON "lichess_oauth_states" ("user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_lichess_oauth_states_expires_at" ON "lichess_oauth_states" ("expires_at")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "lichess_oauth_states"');
    await queryRunner.query('DROP TABLE "lichess_accounts"');
  }
}
