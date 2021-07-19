import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import { ListRentalByIdAndExpectReturnDateController } from '@modules/rentals/infra/http/controllers/ListRentalByIdAndExpectReturnDateController';
import RentalsController from '@modules/rentals/infra/http/controllers/RentalsController';
import { SyncPullRentalsController } from '@modules/rentals/infra/http/controllers/SyncPullRentalsController';
import { ensureAuthenticated } from '@modules/users/infra/http/middleware/ensureAuthenticanted';

const rentalsRouter = Router();
const rentalsController = new RentalsController();
const syncPullRentalsController = new SyncPullRentalsController();
const listRentalByIdAndExpectReturnDateController = new ListRentalByIdAndExpectReturnDateController();

rentalsRouter.use(ensureAuthenticated);

// => /rentals

rentalsRouter.get(
  '/cars/:carId',
  celebrate({
    [Segments.PARAMS]: {
      carId: Joi.string().uuid().required(),
    },
  }),
  listRentalByIdAndExpectReturnDateController.index,
);

rentalsRouter.get('/', rentalsController.index);

rentalsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      carId: Joi.string().uuid().required(),
      startDate: Joi.string().required(),
      expected_return_date: Joi.string().required(),
    },
  }),
  rentalsController.create,
);

rentalsRouter.get('/sync/pull', syncPullRentalsController.handle);

export default rentalsRouter;
