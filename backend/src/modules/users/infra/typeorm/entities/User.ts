import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import UsersGroups from '@modules/users/infra/typeorm/entities/UsersGroups';

import Person from './Person';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => UsersGroups, user_groups => user_groups.user, {
    eager: true,
    cascade: true,
  })
  user_groups: UsersGroups[];

  @OneToOne(() => Person, {
    cascade: true,
  })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @Column()
  person_id: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  is_verified: boolean;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default User;
