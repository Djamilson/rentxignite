import { tableSchema } from '@nozbe/watermelondb';

const rentalSchema = tableSchema({
  name: 'rentals',
  columns: [
    {
      name: 'start_date',
      type: 'string',
    },
    {
      name: 'car_id',
      type: 'string',
    },
    {
      name: 'expected_return_date',
      type: 'string',
    },

    {
      name: 'status',
      type: 'string',
    },

    {
      name: 'total',
      type: 'number',
    },

    {
      name: 'updated_at_',
      type: 'string',
    },
    {
      name: 'car_name',
      type: 'string',
    },
    {
      name: 'car_brand',
      type: 'string',
    },
    {
      name: 'car_about',
      type: 'string',
    },

    {
      name: 'car_daily_rate',
      type: 'number',
    },

    {
      name: 'car_fine_amount',
      type: 'number',
    },
    {
      name: 'car_period',
      type: 'string',
    },
    {
      name: 'car_price',
      type: 'number',
    },
    {
      name: 'car_fuel_type',
      type: 'string',
    },

    {
      name: 'car_category_id',
      type: 'string',
    },

    {
      name: 'car_category_name',
      type: 'string',
    },

    {
      name: 'car_category_description',
      type: 'string',
    },
    {
      name: 'car_thumbnail',
      type: 'string',
    },

    {
      name: 'car_photo_url',
      type: 'string',
    },
  ],
});

export { rentalSchema };
