import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserOnboardingProfile1730000000000 implements MigrationInterface {
  name = 'AddUserOnboardingProfile1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_profiles" (
        "user_id" uuid PRIMARY KEY,
        "display_name" varchar(80),
        "country" char(2),
        "date_of_birth" date,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "fk_user_profiles_user_id"
          FOREIGN KEY ("user_id")
          REFERENCES "users" ("id")
          ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "user_profiles"');
  }
}
