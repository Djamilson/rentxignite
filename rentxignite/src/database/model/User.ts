import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

class User extends Model {
  static table = 'users';

  @field('user_id')
  user_id!: string;

  @field('person_id')
  person_id!: string;

  @field('person_name')
  person_name!: string;

  @field('person_email')
  person_email!: string;

  @field('person_driver_license')
  person_driver_license!: string;

  @field('person_status')
  person_status!: boolean;

  @field('person_privacy')
  person_privacy!: boolean;

  @field('person_avatar')
  person_avatar!: string;

  @field('person_avatar_url')
  person_avatar_url!: string;

  @field('token')
  token!: string;

  @field('refresh_token')
  refresh_token!: string;
}

export { User };
