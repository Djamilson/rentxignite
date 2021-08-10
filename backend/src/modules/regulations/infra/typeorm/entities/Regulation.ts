import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('regulations')
class Regulation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  regulation: string;

  @Column()
  reading_time: number;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export { Regulation };
