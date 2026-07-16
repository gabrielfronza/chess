import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../database/entities';
import { User } from '../../users/entities';

@Entity({ name: 'lichess_accounts' })
@Index('uq_lichess_accounts_active_user', ['userId'], {
  unique: true,
  where: '"revoked_at" IS NULL',
})
@Index('uq_lichess_accounts_active_lichess_user', ['lichessUserId'], {
  unique: true,
  where: '"revoked_at" IS NULL',
})
export class LichessAccount extends AppBaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.lichessAccounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({
    name: 'lichess_user_id',
    type: 'varchar',
    length: 80,
  })
  lichessUserId!: string;

  @Column({ type: 'varchar', length: 80 })
  username!: string;

  @Column({ name: 'access_token_ciphertext', type: 'text' })
  accessTokenCiphertext!: string;

  @Column({ name: 'access_token_iv', type: 'varchar', length: 32 })
  accessTokenIv!: string;

  @Column({ name: 'access_token_auth_tag', type: 'varchar', length: 32 })
  accessTokenAuthTag!: string;

  @Column({ array: true, default: () => 'ARRAY[]::text[]', type: 'text' })
  scopes!: string[];

  @Column({ name: 'token_expires_at', nullable: true, type: 'timestamptz' })
  tokenExpiresAt!: Date | null;

  @Column({ name: 'revoked_at', nullable: true, type: 'timestamptz' })
  revokedAt!: Date | null;
}
