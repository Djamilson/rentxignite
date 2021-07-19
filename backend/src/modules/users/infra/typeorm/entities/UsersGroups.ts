import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

import Group from '@modules/users/infra/typeorm/entities/Group';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('users_groups')
class UsersGroups {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.user_groups)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Group, group => group.user_groups)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column()
  group_id: string;

  @Column()
  user_id: string;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default UsersGroups;
