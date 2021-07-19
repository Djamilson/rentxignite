import { tableSchema } from '@nozbe/watermelondb';

const userSchema = tableSchema({
  name: 'users',
  columns: [
    {
      name: 'user_id',
      type: 'string',
    },
    {
      name: 'person_id',
      type: 'string',
    },
    {
      name: 'person_name',
      type: 'string',
    },
    {
      name: 'person_email',
      type: 'string',
    },
    {
      name: 'person_driver_license',
      type: 'string',
    },
    {
      name: 'person_status',
      type: 'boolean',
    },

    {
      name: 'person_privacy',
      type: 'boolean',
    },
    {
      name: 'person_avatar',
      type: 'string',
    },
    {
      name: 'person_avatar_url',
      type: 'string',
    },
    {
      name: 'token',
      type: 'string',
    },
    {
      name: 'refresh_token',
      type: 'string',
    },
  ],
});

export { userSchema };
