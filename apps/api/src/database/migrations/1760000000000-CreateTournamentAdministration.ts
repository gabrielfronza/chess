import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTournamentAdministration1760000000000 implements MigrationInterface {
  name = 'CreateTournamentAdministration1760000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tournaments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(160) NOT NULL,
        "description" text,
        "starts_at" timestamptz,
        "duration_minutes" integer,
        "time_control" varchar(80),
        "rounds" integer,
        "entry_fee_cents" integer NOT NULL DEFAULT 0 CHECK ("entry_fee_cents" >= 0),
        "prize_pool_cents" integer NOT NULL DEFAULT 0 CHECK ("prize_pool_cents" >= 0),
        "rules" text,
        "lichess_tournament_id" varchar(120),
        "status" varchar(32) NOT NULL DEFAULT 'DRAFT'
          CHECK ("status" IN ('DRAFT', 'PUBLISHED', 'REGISTRATION_CLOSED', 'RUNNING', 'FINISHED', 'CANCELLED')),
        "registration_count" integer NOT NULL DEFAULT 0 CHECK ("registration_count" >= 0),
        "cancellation_reason" text,
        "refund_status" varchar(16) NOT NULL DEFAULT 'NONE'
          CHECK ("refund_status" IN ('NONE', 'PENDING')),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_tournaments_lichess_id"
        ON "tournaments" ("lichess_tournament_id")
        WHERE "lichess_tournament_id" IS NOT NULL AND "deleted_at" IS NULL
    `);
    await queryRunner.query(
      'CREATE INDEX "idx_tournaments_status_starts_at" ON "tournaments" ("status", "starts_at")',
    );
    await queryRunner.query(`
      CREATE TABLE "tournament_audit_events" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tournament_id" uuid NOT NULL REFERENCES "tournaments" ("id") ON DELETE CASCADE,
        "actor_user_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE RESTRICT,
        "action" varchar(40) NOT NULL,
        "details" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "idx_tournament_audit_events_tournament" ON "tournament_audit_events" ("tournament_id", "created_at")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "tournament_audit_events"');
    await queryRunner.query('DROP TABLE "tournaments"');
  }
}
