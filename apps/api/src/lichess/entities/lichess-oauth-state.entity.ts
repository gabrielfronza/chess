import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../database/entities';
import { User } from '../../users/entities';

@Entity({ name: 'lichess_oauth_states' })
export class LichessOAuthState extends AppBaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'state_hash', type: 'varchar', length: 128, unique: true })
  stateHash!: string;

  @Column({ name: 'code_verifier', type: 'varchar', length: 512 })
  codeVerifier!: string;

  @Column({ name: 'redirect_uri', type: 'text' })
  redirectUri!: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ name: 'consumed_at', nullable: true, type: 'timestamptz' })
  consumedAt!: Date | null;
}
