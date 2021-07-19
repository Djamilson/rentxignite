import { Expose } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import uploadConfig from '@config/upload';

import Phone from './Phone';

@Entity('persons')
class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cpf: string;

  @Column()
  rg: string;

  @Column()
  rgss: string;

  @Column()
  driver_license: string;

  @Column()
  birdth_date: Date;

  @Column()
  email: string;

  @Column()
  status: boolean;

  @Column()
  privacy: boolean;

  @Column()
  avatar: string;

  @OneToOne(() => Phone)
  @JoinColumn({ name: 'phone_id_main' })
  phone: Phone;

  @Column()
  phone_id_main: string;

  @Column()
  address_id_main: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }
    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_URL_BACKEND}/files/${this.avatar}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`;
      default:
        return null;
    }
  }
}

export default Person;
