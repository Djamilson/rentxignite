import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import { CarPhotoController } from '@modules/cars/infra/http/controllers/CarPhotoController';
import CarsController from '@modules/cars/infra/http/controllers/CarsController';
import { CarsListAvailableController } from '@modules/cars/infra/http/controllers/CarsListAvailableController';
import { CarsListPaginationController } from '@modules/cars/infra/http/controllers/CarsListPaginationController';
import { CarThumbnailController } from '@modules/cars/infra/http/controllers/CarThumbnailController';
import { SyncPullCarsController } from '@modules/cars/infra/http/controllers/SyncPullCarsController';
import { UpdateCarsController } from '@modules/cars/infra/http/controllers/UpdateCarsController';
import { UpdateLicensePlateCarsController } from '@modules/cars/infra/http/controllers/UpdateLicensePlateController';
import { UpdateSpecificationsCarsController } from '@modules/cars/infra/http/controllers/UpdateSpecificationsCarsController';
import { ensureAuthenticated } from '@modules/users/infra/http/middleware/ensureAuthenticanted';

import uploadConfig from '@config/upload';

const upload = multer(uploadConfig.multer);

const carsRouter = Router();
const carsController = new CarsController();

const carThumbnailController = new CarThumbnailController();
const syncPullCarsController = new SyncPullCarsController();

const updateSpecificationsCarsController = new UpdateSpecificationsCarsController();
const carPhotoController = new CarPhotoController();
const updateLicensePlateCarsController = new UpdateLicensePlateCarsController();
const updateCarsController = new UpdateCarsController();

const carsListAvailableController = new CarsListAvailableController();
const carsListPaginationController = new CarsListPaginationController();

// not authentications

carsRouter.get(
  '/available',
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string().required(),
      brand: Joi.string().required(),
      category_id: Joi.string().uuid().required(),
    },
  }),
  carsListAvailableController.index,
);

// authentication
carsRouter.use(ensureAuthenticated);

// => /cars

carsRouter.get('/pagination', carsListPaginationController.index);

carsRouter.get('/', carsController.index);
carsRouter.get(
  '/:carId',
  celebrate({
    [Segments.PARAMS]: {
      carId: Joi.string().uuid().required(),
    },
  }),
  carsController.show,
);

carsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),

      daily_rate: Joi.number().required(),
      license_plate: Joi.string().required(),
      fine_amount: Joi.number().required(),
      brand: Joi.string().required(),

      about: Joi.string().required(),
      period: Joi.string().required(),
      price: Joi.number().required(),
      fuel_type: Joi.string().required(),

      category_id: Joi.string().uuid().required(),
      specifications: Joi.array().items(Joi.string()),
    },
  }),
  carsController.create,
);

carsRouter.post(
  '/specifications/:carId',
  celebrate({
    [Segments.PARAMS]: {
      carId: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      specifications_ids: Joi.array().items(Joi.string()),
    },
  }),
  updateSpecificationsCarsController.create,
);

carsRouter.put(
  '/:carId',
  celebrate({
    [Segments.PARAMS]: {
      carId: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),

      daily_rate: Joi.number().required(),
      fine_amount: Joi.number().required(),
      brand: Joi.string().required(),

      about: Joi.string().required(),
      period: Joi.string().required(),
      available: Joi.string().required(),
      price: Joi.number().required(),
      fuel_type: Joi.string().required(),

      category_id: Joi.string().uuid().required(),
    },
  }),
  updateCarsController.update,
);

carsRouter.patch(
  '/:carId/license/plate',
  celebrate({
    [Segments.PARAMS]: {
      carId: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      license_plate: Joi.string().required(),
    },
  }),
  updateLicensePlateCarsController.update,
);

carsRouter.post(
  '/photos/:carId',
  upload.single('file'),
  carPhotoController.create,
);

carsRouter.patch(
  '/photos/update/:photoId',
  upload.single('file'),
  carPhotoController.update,
);

carsRouter.post(
  '/photos/thumbnail',
  upload.single('file'),
  carThumbnailController.create,
);

carsRouter.get('/sync/pull', syncPullCarsController.handle);

export default carsRouter;
