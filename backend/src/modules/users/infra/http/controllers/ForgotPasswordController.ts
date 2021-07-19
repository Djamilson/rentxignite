import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;
      const sendForgotPasswordEmail = container.resolve(
        SendForgotPasswordEmailService,
      );

      await sendForgotPasswordEmail.execute({ email });

      return res.status(204).json();
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
