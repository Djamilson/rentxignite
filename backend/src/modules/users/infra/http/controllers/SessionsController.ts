import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, device } = req.body;

      const authenticateUser = container.resolve(AuthenticateUserService);

      const { user, token, refreshToken } = await authenticateUser.execute({
        email,
        password,
        device,
      });

      // dentro do token tem expiresIn

      return res.json({
        user: classToClass(user),
        token,
        refreshToken,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
