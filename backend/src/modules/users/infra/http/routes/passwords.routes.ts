import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';
import { ValidationCodeController } from '../controllers/ValidationCodeController';

const passwordsRouter = Router();

const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();
const validationCodeController = new ValidationCodeController();

passwordsRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create,
);

passwordsRouter.put(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().optional().allow(''),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resetPasswordController.create,
);

passwordsRouter.post(
  '/validationCode',
  celebrate({
    [Segments.BODY]: {
      code: Joi.string().required(),
    },
  }),
  validationCodeController.index,
);

export default passwordsRouter;
