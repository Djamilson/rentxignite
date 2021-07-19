import { Router } from 'express';

import { ensureAuthenticated } from '@modules/users/infra/http/middleware/ensureAuthenticanted';

import StatesController from '../controllers/StatesController';

const statesRouter = Router();
const statesController = new StatesController();

statesRouter.use(ensureAuthenticated);

statesRouter.get('/', statesController.index);

export default statesRouter;
