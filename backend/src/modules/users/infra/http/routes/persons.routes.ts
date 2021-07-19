import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import DocumentsController from '../controllers/DocumentsController';
import PersonAddressPhoneController from '../controllers/PersonAddressPhoneController';
import PersonAllDataController from '../controllers/PersonAllDataController';
import PersonDocumentsAddressController from '../controllers/PersonDocumentsAddressController';
import PersonDocumentsPhoneController from '../controllers/PersonDocumentsPhoneController';
import PersonsController from '../controllers/PersonsController';
import { ensureAuthenticated } from '../middleware/ensureAuthenticanted';

const personsRouter = Router();
const personsController = new PersonsController();
const documentsController = new DocumentsController();
const personAllDataController = new PersonAllDataController();
const personAddressPhoneController = new PersonAddressPhoneController();
const personDocumentsAddressController = new PersonDocumentsAddressController();
const personDocumentsPhoneController = new PersonDocumentsPhoneController();

personsRouter.use(ensureAuthenticated);

personsRouter.get('/:personId', personsController.show);
personsRouter.put(
  '/documents',
  celebrate({
    [Segments.BODY]: {
      cpf: Joi.string().required(),
      rg: Joi.string().required(),
      rgss: Joi.string().required(),
      birdthDate: Joi.string().required(),
    },
  }),
  documentsController.update,
);

personsRouter.post(
  '/documents/all',
  celebrate({
    [Segments.BODY]: {
      cpf: Joi.string().required(),
      rg: Joi.string().required(),
      rgss: Joi.string().required(),
      birdthDate: Joi.string().required(),

      number: Joi.string().required(),
      street: Joi.string().required(),
      complement: Joi.string().required(),
      neighborhood: Joi.string().required(),
      zip_code: Joi.string().required(),
      city_id: Joi.string().required(),

      phone: Joi.string().required(),
    },
  }),
  personAllDataController.create,
);

personsRouter.post(
  '/documents/addresses',
  celebrate({
    [Segments.BODY]: {
      cpf: Joi.string().required(),
      rg: Joi.string().required(),
      rgss: Joi.string().required(),
      birdthDate: Joi.string().required(),

      number: Joi.string().required(),
      street: Joi.string().required(),
      complement: Joi.string().required(),
      neighborhood: Joi.string().required(),
      zip_code: Joi.string().required(),
      city_id: Joi.string().required(),
    },
  }),

  personDocumentsAddressController.create,
);

personsRouter.post(
  '/documents/phones',
  celebrate({
    [Segments.BODY]: {
      cpf: Joi.string().required(),
      rg: Joi.string().required(),
      rgss: Joi.string().required(),
      birdthDate: Joi.string().required(),

      phone: Joi.string().required(),
    },
  }),
  personDocumentsPhoneController.create,
);

personsRouter.post(
  '/addresses/phones',
  celebrate({
    [Segments.BODY]: {
      number: Joi.string().required(),
      street: Joi.string().required(),
      complement: Joi.string().required(),
      neighborhood: Joi.string().required(),
      zip_code: Joi.string().required(),
      city_id: Joi.string().required(),

      phone: Joi.string().required(),
    },
  }),
  personAddressPhoneController.create,
);

export default personsRouter;
