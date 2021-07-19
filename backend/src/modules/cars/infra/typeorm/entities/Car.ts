import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from '@modules/categories/infra/typeorm/entities/Category';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { Specification } from '@modules/specifications/infra/typeorm/entities/Specification';

import { Photo } from './Photo';

@Entity('cars')
class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  about: string;

  @Column()
  license_plate: string;

  @Column()
  available: boolean;

  @Column()
  daily_rate: number;

  @Column()
  fine_amount: number;

  @Column()
  period: string;

  @Column()
  price: number;

  @Column()
  fuel_type: string;

  @OneToMany(() => Photo, photo => photo.car)
  @JoinColumn({ name: 'id' })
  photos: Photo[];

  @OneToMany(() => Rental, rental => rental.car)
  @JoinColumn({ name: 'id' })
  rentals: Rental[];

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: string;

  @OneToOne(() => Photo)
  @JoinColumn({ name: 'photo_id' })
  photo: Photo;

  @Column()
  photo_id: string;

  @ManyToMany(() => Specification)
  @JoinTable({
    name: 'specifications_cars',
    joinColumns: [{ name: 'car_id' }],
    inverseJoinColumns: [{ name: 'specification_id' }],
  })
  specifications: Specification[];

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export { Car };
