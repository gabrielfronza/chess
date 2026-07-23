import type { WalletEntryType } from '@checkmatetour/contracts';
import { Column, Entity, Index } from 'typeorm';
import { AppBaseEntity } from '../../database/entities';

@Entity({ name: 'wallet_entries' })
@Index('uq_wallet_entries_user_idempotency', ['userId', 'idempotencyKey'], {
  unique: true,
})
export class WalletEntry extends AppBaseEntity {
  @Column({ name: 'wallet_id', type: 'uuid' })
  walletId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ length: 24, type: 'varchar' })
  type!: WalletEntryType;

  @Column({ name: 'amount_cents', type: 'integer' })
  amountCents!: number;

  @Column({ nullable: true, type: 'text' })
  reason!: string | null;

  @Column({ length: 200, nullable: true, type: 'varchar' })
  reference!: string | null;

  @Column({ name: 'actor_user_id', nullable: true, type: 'uuid' })
  actorUserId!: string | null;

  @Column({ name: 'idempotency_key', type: 'varchar', length: 200 })
  idempotencyKey!: string;
}
