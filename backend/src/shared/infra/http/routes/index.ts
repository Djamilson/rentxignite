import { Router } from 'express';

import carsRouter from '@modules/cars/infra/http/routes/cars.routes';
import categoriesRouter from '@modules/categories/infra/http/routes/categories.routes';
import citiesRouter from '@modules/locality/infra/http/routes/cities.routes';
import statesRouter from '@modules/locality/infra/http/routes/states.routes';
import refreshTokenRouter from '@modules/refreshesTokens/infra/http/routes/refresh.token.routes';
import regulationsRouter from '@modules/regulations/infra/http/routes/regulations.routes';
import rentalsRouter from '@modules/rentals/infra/http/routes/rentals.routes';
import specificationsRouter from '@modules/specifications/infra/http/routes/specifications.routes';
import addressesRouter from '@modules/users/infra/http/routes/addresses.routes';
import groupsRouter from '@modules/users/infra/http/routes/groups.routes';
import infoClientsRouter from '@modules/users/infra/http/routes/infoclients.routes';
import passwordsRouter from '@modules/users/infra/http/routes/passwords.routes';
import personsRouter from '@modules/users/infra/http/routes/persons.routes';
import phonesRouter from '@modules/users/infra/http/routes/phones.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import usersMobilesRouter from '@modules/users/infra/http/routes/users.mobiles.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';

const routes = Router();

// mobile create ecount
routes.use('/users/mobiles', usersMobilesRouter);

routes.use('/users', usersRouter);

routes.use('/sessions', sessionsRouter);
routes.use('/refresh', refreshTokenRouter);
routes.use('/groups', groupsRouter);

routes.use('/info/clients', infoClientsRouter);
routes.use('/addresses', addressesRouter);
routes.use('/phones', phonesRouter);
routes.use('/persons', personsRouter);

routes.use('/passwords', passwordsRouter);
routes.use('/profiles', profileRouter);

routes.use('/cities', citiesRouter);
routes.use('/states', statesRouter);

routes.use('/categories', categoriesRouter);
routes.use('/specifications', specificationsRouter);
routes.use('/cars', carsRouter);

routes.use('/rentals', rentalsRouter);

routes.use('/regulations', regulationsRouter);

export default routes;
