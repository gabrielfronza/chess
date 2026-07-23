import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AppBaseEntity } from '../../database/entities';
import { User } from '../../users/entities';

@Entity({ name: 'wallets' })
export class Wallet extends AppBaseEntity {
  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({
    default: 0,
    name: 'available_balance_cents',
    type: 'integer',
  })
  availableBalanceCents!: number;

  @Column({
    default: 0,
    name: 'reserved_balance_cents',
    type: 'integer',
  })
  reservedBalanceCents!: number;
}
