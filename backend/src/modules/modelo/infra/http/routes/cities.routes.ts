import { Router } from 'express';

import { ensureAuthenticated } from '@modules/users/infra/http/middleware/ensureAuthenticanted';

import CitiesController from '../controllers/CitiesController';

const citiesRouter = Router();
const citiesController = new CitiesController();

citiesRouter.use(ensureAuthenticated);

citiesRouter.get('/:state_id/select', citiesController.index);

export default citiesRouter;
