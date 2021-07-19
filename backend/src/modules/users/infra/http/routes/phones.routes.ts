import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import PhoneMainController from '../controllers/PhoneMainController';
import PhonesController from '../controllers/PhonesController';
import { ensureAuthenticated } from '../middleware/ensureAuthenticanted';

const phonesRouter = Router();
const phonesController = new PhonesController();
const phoneMainController = new PhoneMainController();

phonesRouter.use(ensureAuthenticated);

phonesRouter.post(
  '/users',
  celebrate({
    [Segments.BODY]: {
      phone: Joi.string().required(),
    },
  }),
  phonesController.create,
);

phonesRouter.get('/users', phonesController.index);
phonesRouter.get('/:phoneId', phonesController.show);
phonesRouter.delete('/:phoneId', phonesController.destroy);
phonesRouter.put(
  '/users',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      person_id: Joi.string().required(),
      phone: Joi.string().required(),
    },
  }),
  phonesController.update,
);

phonesRouter.put('/main/:phoneId', phoneMainController.put);

export default phonesRouter;
