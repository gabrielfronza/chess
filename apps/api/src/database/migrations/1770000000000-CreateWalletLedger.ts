import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWalletLedger1770000000000 implements MigrationInterface {
  name = 'CreateWalletLedger1770000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "wallets" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL UNIQUE REFERENCES "users" ("id") ON DELETE CASCADE,
        "available_balance_cents" integer NOT NULL DEFAULT 0 CHECK ("available_balance_cents" >= 0),
        "reserved_balance_cents" integer NOT NULL DEFAULT 0 CHECK ("reserved_balance_cents" >= 0),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "wallet_entries" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "wallet_id" uuid NOT NULL REFERENCES "wallets" ("id") ON DELETE RESTRICT,
        "user_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE RESTRICT,
        "type" varchar(24) NOT NULL CHECK ("type" IN ('CREDIT', 'DEBIT', 'RESERVE', 'RELEASE', 'ADJUSTMENT')),
        "amount_cents" integer NOT NULL CHECK ("amount_cents" <> 0),
        "reason" text,
        "reference" varchar(200),
        "actor_user_id" uuid REFERENCES "users" ("id") ON DELETE RESTRICT,
        "idempotency_key" varchar(200) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "idx_wallet_entries_user_created" ON "wallet_entries" ("user_id", "created_at" DESC, "id" DESC)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "uq_wallet_entries_user_idempotency" ON "wallet_entries" ("user_id", "idempotency_key")',
    );
    await queryRunner.query(`
      CREATE FUNCTION prevent_wallet_entry_mutation() RETURNS trigger AS $$
      BEGIN
        RAISE EXCEPTION 'wallet entries are immutable';
      END;
      $$ LANGUAGE plpgsql
    `);
    await queryRunner.query(`
      CREATE TRIGGER "trg_wallet_entries_immutable"
      BEFORE UPDATE OR DELETE ON "wallet_entries"
      FOR EACH ROW EXECUTE FUNCTION prevent_wallet_entry_mutation()
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP TRIGGER "trg_wallet_entries_immutable" ON "wallet_entries"',
    );
    await queryRunner.query('DROP FUNCTION prevent_wallet_entry_mutation()');
    await queryRunner.query('DROP TABLE "wallet_entries"');
    await queryRunner.query('DROP TABLE "wallets"');
  }
}
