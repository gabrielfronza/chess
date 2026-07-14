import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../database/entities';
import { UserRole } from '../types';

@Entity({ name: 'users' })
export class User extends AppBaseEntity {
  @Column({ name: 'auth0_subject', type: 'varchar', length: 255, unique: true })
  auth0Subject!: string;

  @Column({ nullable: true, type: 'varchar', length: 320 })
  email!: string | null;

  @Column({ array: true, default: () => "ARRAY['USER']::text[]", type: 'text' })
  roles!: UserRole[];
}
