import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import RegulationController from '@modules/regulations/infra/http/controllers/RegulationsController';
import { SyncPullRegulationsController } from '@modules/regulations/infra/http/controllers/SyncPullRegulationsController';
import { ensureAuthenticated } from '@modules/users/infra/http/middleware/ensureAuthenticanted';

const regulationsRouter = Router();
const regulationsController = new RegulationController();
const syncPullRegulationsController = new SyncPullRegulationsController();

// => /regulations

regulationsRouter.get('/', regulationsController.index);
regulationsRouter.get('/sync/pull', syncPullRegulationsController.handle);

// precisa está autentication

regulationsRouter.use(ensureAuthenticated);

regulationsRouter.put(
  '/:regulation_id',
  celebrate({
    [Segments.PARAMS]: {
      regulation_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      regulation: Joi.string().required(),
    },
  }),
  regulationsController.update,
);

regulationsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      regulation: Joi.string().required(),
    },
  }),
  regulationsController.create,
);

export default regulationsRouter;
