import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import CategoriesController from '@modules/categories/infra/http/controllers/CategoriesController';
import { CategoriesListPaginationController } from '@modules/categories/infra/http/controllers/CategoriesListPaginationController';
import { UpdateDescriptionCategoriesController } from '@modules/categories/infra/http/controllers/UpdateDescriptionCategoriesController';
import { UpdateNameCategoriesController } from '@modules/categories/infra/http/controllers/UpdateNameCategoriesController';
import { ensureAuthenticated } from '@modules/users/infra/http/middleware/ensureAuthenticanted';

const categoriesRouter = Router();
const categoriesController = new CategoriesController();

const updateDescriptionCategoriesController = new UpdateDescriptionCategoriesController();
const updateNameCategoriesController = new UpdateNameCategoriesController();

const categoriesListPaginationController = new CategoriesListPaginationController();

categoriesRouter.use(ensureAuthenticated);

// => /categories

// categoriesRouter.get('/', categoriesController.index);

categoriesRouter.get('/pagination', categoriesListPaginationController.index);

categoriesRouter.get('/', categoriesController.index);
categoriesRouter.get('/:categoryId', categoriesController.show);

categoriesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required(),
    },
  }),
  categoriesController.create,
);

categoriesRouter.patch(
  '/:categoryId/name',
  celebrate({
    [Segments.PARAMS]: {
      categoryId: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  updateNameCategoriesController.update,
);

categoriesRouter.patch(
  '/:categoryId/description',
  celebrate({
    [Segments.PARAMS]: {
      categoryId: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      description: Joi.string().required(),
    },
  }),
  updateDescriptionCategoriesController.update,
);

export default categoriesRouter;
