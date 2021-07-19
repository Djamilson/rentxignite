import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import { ensureAuthenticated } from '@modules/users/infra/http/middleware/ensureAuthenticanted';

import { SyncPullUsersController } from '../controllers/SyncPullUsersController';
import { UsersMobilesController } from '../controllers/UsersMobilesController';

const syncPullUsersController = new SyncPullUsersController();

const usersMobilesRouter = Router();
const usersMobilesController = new UsersMobilesController();

// route users/mobiles
usersMobilesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      nameGroup: Joi.string().required(),
      password: Joi.string().required(),
      driver_license: Joi.string().required(),
    },
  }),
  usersMobilesController.create,
);

// autentication
// /users/mobiles/sync
usersMobilesRouter.use(ensureAuthenticated);
usersMobilesRouter.post('/sync', syncPullUsersController.handle);

export default usersMobilesRouter;
