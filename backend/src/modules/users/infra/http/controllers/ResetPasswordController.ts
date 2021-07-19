import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ResetPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { token, password } = req.body;
      const resetPassword = container.resolve(ResetPasswordService);

      await resetPassword.execute({ token, password });

      return res.status(204).json();
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
