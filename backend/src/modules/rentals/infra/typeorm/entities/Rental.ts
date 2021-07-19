import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('rentals')
class Rental {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  car_id: string;

  @ManyToOne(() => Car)
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column()
  status: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column('timestamp with time zone')
  expected_return_date: Date;

  @Column('decimal')
  total: number;

  @CreateDateColumn()
  canceled_at: Date;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export { Rental };
