import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';
import ProfilePasswordController from '../controllers/ProfilePasswordController';
import { ensureAuthenticated } from '../middleware/ensureAuthenticanted';

const profileRouter = Router();
const profileController = new ProfileController();
const profilePasswordController = new ProfilePasswordController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  }),
  profileController.update,
);

profileRouter.put(
  '/passwords',
  celebrate({
    [Segments.BODY]: {
      old_password: Joi.string().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profilePasswordController.update,
);

export default profileRouter;
