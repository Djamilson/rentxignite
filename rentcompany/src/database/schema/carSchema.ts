import { tableSchema } from '@nozbe/watermelondb';

const carSchema = tableSchema({
  name: 'cars',
  columns: [
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'brand',
      type: 'string',
    },
    {
      name: 'about',
      type: 'string',
    },

    {
      name: 'daily_rate',
      type: 'number',
    },

    {
      name: 'fine_amount',
      type: 'number',
    },
    {
      name: 'period',
      type: 'string',
    },
    {
      name: 'price',
      type: 'number',
    },
    {
      name: 'fuel_type',
      type: 'string',
    },

    {
      name: 'category_id',
      type: 'string',
    },

    {
      name: 'category_name',
      type: 'string',
    },

    {
      name: 'category_description',
      type: 'string',
    },
    {
      name: 'thumbnail',
      type: 'string',
    },

    {
      name: 'photo_url',
      type: 'string',
    },
    {
      name: 'updated_at_',
      type: 'string',
    },
  ],
});

export { carSchema };
