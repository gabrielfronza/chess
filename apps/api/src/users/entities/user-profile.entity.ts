import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AppBaseEntity } from '../../database/entities';
import { User } from './user.entity';

@Entity({ name: 'user_profiles' })
export class UserProfile extends AppBaseEntity {
  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId!: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'display_name', nullable: true, type: 'varchar', length: 80 })
  displayName!: string | null;

  @Column({ nullable: true, type: 'char', length: 2 })
  country!: string | null;

  @Column({ name: 'date_of_birth', nullable: true, type: 'date' })
  dateOfBirth!: string | null;
}
