import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import SpecificationsController from '@modules/specifications/infra/http/controllers/SpecificationsController';
import { SpecificationsListPaginationController } from '@modules/specifications/infra/http/controllers/SpecificationsListPaginationController';
import { UpdateDescriptionSpecificationsController } from '@modules/specifications/infra/http/controllers/UpdateDescriptionSpecificationsController';
import { UpdateNameSpecificationsController } from '@modules/specifications/infra/http/controllers/UpdateNameSpecificationsController';
import { UpdateTypeSpecificationsController } from '@modules/specifications/infra/http/controllers/UpdateTypeSpecificationsController';
import { ensureAuthenticated } from '@modules/users/infra/http/middleware/ensureAuthenticanted';

const specificationsRouter = Router();
const specificationsController = new SpecificationsController();

const updateDescriptionSpecificationsController = new UpdateDescriptionSpecificationsController();
const updateNameSpecificationsController = new UpdateNameSpecificationsController();
const updateTypeSpecificationsController = new UpdateTypeSpecificationsController();

const specificationsListPaginationController = new SpecificationsListPaginationController();

specificationsRouter.use(ensureAuthenticated);

// => /specifications

specificationsRouter.get(
  '/pagination',
  specificationsListPaginationController.index,
);

specificationsRouter.get('/', specificationsController.index);
specificationsRouter.get('/:specificationId', specificationsController.show);

specificationsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      type: Joi.string().required(),
      description: Joi.string().required(),
    },
  }),
  specificationsController.create,
);

specificationsRouter.patch(
  '/:specificationId/name',
  celebrate({
    [Segments.PARAMS]: {
      specificationId: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  updateNameSpecificationsController.update,
);

specificationsRouter.patch(
  '/:specificationId/type',
  celebrate({
    [Segments.PARAMS]: {
      specificationId: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      type: Joi.string().required(),
    },
  }),
  updateTypeSpecificationsController.update,
);

specificationsRouter.patch(
  '/:specificationId/description',
  celebrate({
    [Segments.PARAMS]: {
      specificationId: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      description: Joi.string().required(),
    },
  }),
  updateDescriptionSpecificationsController.update,
);

export default specificationsRouter;
