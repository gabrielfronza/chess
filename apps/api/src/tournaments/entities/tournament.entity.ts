import { Column, Entity } from 'typeorm';
import type { TournamentStatus } from '@checkmatetour/contracts';
import { AppBaseEntity } from '../../database/entities';
import type { RefundStatus } from '../types';

@Entity({ name: 'tournaments' })
export class Tournament extends AppBaseEntity {
  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ nullable: true, type: 'text' })
  description!: string | null;

  @Column({ name: 'starts_at', nullable: true, type: 'timestamptz' })
  startsAt!: Date | null;

  @Column({ name: 'duration_minutes', nullable: true, type: 'integer' })
  durationMinutes!: number | null;

  @Column({ name: 'time_control', nullable: true, type: 'varchar', length: 80 })
  timeControl!: string | null;

  @Column({ nullable: true, type: 'integer' })
  rounds!: number | null;

  @Column({ default: 0, name: 'entry_fee_cents', type: 'integer' })
  entryFeeCents!: number;

  @Column({ default: 0, name: 'prize_pool_cents', type: 'integer' })
  prizePoolCents!: number;

  @Column({ nullable: true, type: 'text' })
  rules!: string | null;

  @Column({
    name: 'lichess_tournament_id',
    nullable: true,
    type: 'varchar',
    length: 120,
  })
  lichessTournamentId!: string | null;

  @Column({ default: 'DRAFT', type: 'varchar', length: 32 })
  status!: TournamentStatus;

  @Column({ default: 0, name: 'registration_count', type: 'integer' })
  registrationCount!: number;

  @Column({ name: 'cancellation_reason', nullable: true, type: 'text' })
  cancellationReason!: string | null;

  @Column({
    default: 'NONE',
    name: 'refund_status',
    type: 'varchar',
    length: 16,
  })
  refundStatus!: RefundStatus;
}
