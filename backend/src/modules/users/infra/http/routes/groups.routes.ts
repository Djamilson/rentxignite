import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import GroupsController from '../controllers/GroupsController';
import { ensureAuthenticated } from '../middleware/ensureAuthenticanted';

const groupsRouter = Router();
const groupsController = new GroupsController();

groupsRouter.use(ensureAuthenticated);

groupsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required(),
    },
  }),
  groupsController.create,
);

export default groupsRouter;
