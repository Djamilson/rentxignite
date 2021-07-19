import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import DocumentsController from '../controllers/DocumentsController';
import InfoClientsController from '../controllers/InfoClientsController';
import { ensureAuthenticated } from '../middleware/ensureAuthenticanted';

const infoClientsRouter = Router();
const infoClientsController = new InfoClientsController();
const documentsController = new DocumentsController();

infoClientsRouter.use(ensureAuthenticated);

infoClientsRouter.post('/', infoClientsController.create);
infoClientsRouter.put(
  '/documents',
  celebrate({
    [Segments.BODY]: {
      birdthDate: Joi.string().required(),
      cpf: Joi.string().required(),
      rg: Joi.string(),
      rgss: Joi.string(),
    },
  }),
  documentsController.update,
);

export default infoClientsRouter;
