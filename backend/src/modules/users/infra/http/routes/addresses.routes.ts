import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import { ensureAuthenticated } from '@modules/users/infra/http/middleware/ensureAuthenticanted';

import AddressesController from '../controllers/AddressesController';
import AddressMainController from '../controllers/AddressMainController';

const addressesRouter = Router();
const addressesController = new AddressesController();
const addressMainController = new AddressMainController();

addressesRouter.use(ensureAuthenticated);

addressesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      number: Joi.number().required(),
      street: Joi.string().required(),
      complement: Joi.string().required(),
      zip_code: Joi.string().required(),
      neighborhood: Joi.string().required(),
      city_id: Joi.string().required(),
    },
  }),
  addressesController.create,
);

addressesRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      number: Joi.number().required(),
      street: Joi.string().required(),
      complement: Joi.string().required(),
      zip_code: Joi.string().required(),
      neighborhood: Joi.string().required(),
      city_id: Joi.string().required(),
    },
  }),
  addressesController.update,
);

addressesRouter.delete('/:phoneId', addressesController.destroy);
addressesRouter.get('/users', addressesController.index);
addressesRouter.get('/users/:addressId', addressesController.show);
addressesRouter.put('/main/:addressId', addressMainController.put);

export default addressesRouter;
