import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

class Rental extends Model {
  static table = 'rentals';

  @field('car_id')
  car_id!: string;

  @field('status')
  status!: string;

  @field('start_date')
  start_date!: string;

  @field('expected_return_date')
  expected_return_date!: string;

  @field('total')
  total!: number;

  @date('updated_at_')
  updated_at_!: string;

  @field('car_name')
  car_name!: string;

  @field('car_brand')
  car_brand!: string;

  @field('car_about')
  car_about!: string;

  @field('car_daily_rate')
  car_daily_rate!: number;

  @field('car_fine_amount')
  car_fine_amount!: number;

  @field('car_period')
  car_period!: string;

  @field('car_price')
  car_price!: number;

  @field('fuel_type')
  car_fuel_type!: string;

  @field('car_category_id')
  car_category_id!: string;

  @field('car_category_name')
  car_category_name!: string;

  @field('car_category_description')
  car_category_description!: string;

  @field('car_thumbnail')
  car_thumbnail!: string;

  @field('car_photo_url')
  car_photo_url!: string;
}

export { Rental };
