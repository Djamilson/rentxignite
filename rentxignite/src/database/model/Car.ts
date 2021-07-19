import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

class Car extends Model {
  static table = 'cars';

  @field('name')
  name!: string;

  @field('brand')
  brand!: string;

  @field('about')
  about!: string;

  @field('daily_rate')
  daily_rate!: number;

  @field('fine_amount')
  fine_amount!: number;

  @field('period')
  period!: string;

  @field('price')
  price!: number;

  @field('fuel_type')
  fuel_type!: string;

  @field('category_id')
  category_id!: string;

  @field('category_name')
  category_name!: string;

  @field('category_description')
  category_description!: string;

  @field('thumbnail')
  thumbnail!: string;

  @field('photo_url')
  photo_url!: string;
}

export { Car };
