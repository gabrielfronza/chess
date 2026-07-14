import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersForAuth1720000000000 implements MigrationInterface {
  name = 'CreateUsersForAuth1720000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "auth0_subject" varchar(255) NOT NULL UNIQUE,
        "email" varchar(320),
        "roles" text[] NOT NULL DEFAULT ARRAY['USER']::text[],
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_users_email"
      ON "users" ("email")
      WHERE "email" IS NOT NULL
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "idx_users_email"');
    await queryRunner.query('DROP TABLE "users"');
  }
}
