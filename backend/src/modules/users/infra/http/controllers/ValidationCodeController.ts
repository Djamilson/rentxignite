import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ValidationCodeService from '@modules/users/services/ValidationCodeService';

class ValidationCodeController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { code } = req.body;
      const validationCode = container.resolve(ValidationCodeService);

      const token = await validationCode.execute({ code });

      return res.status(201).json(token);
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}

export { ValidationCodeController };
