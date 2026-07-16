import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { AppBaseEntity } from '../../database/entities';
import { LichessAccount } from '../../lichess/entities';
import { UserRole } from '../types';
import { UserProfile } from './user-profile.entity';

@Entity({ name: 'users' })
export class User extends AppBaseEntity {
  @Column({ name: 'auth0_subject', type: 'varchar', length: 255, unique: true })
  auth0Subject!: string;

  @Column({ nullable: true, type: 'varchar', length: 320 })
  email!: string | null;

  @Column({ array: true, default: () => "ARRAY['USER']::text[]", type: 'text' })
  roles!: UserRole[];

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile?: UserProfile | null;

  @OneToMany(() => LichessAccount, (lichessAccount) => lichessAccount.user)
  lichessAccounts?: LichessAccount[];
}
