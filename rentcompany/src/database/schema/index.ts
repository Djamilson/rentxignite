import { appSchema } from '@nozbe/watermelondb';

import { userSchema } from './userSchema';
import { carSchema } from './carSchema';
import { rentalSchema } from './rentalSchema';

const schemas = appSchema({
  version: 3,
  tables: [userSchema, carSchema, rentalSchema],
});

export { schemas };
