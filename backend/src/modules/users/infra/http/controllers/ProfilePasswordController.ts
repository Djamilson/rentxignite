import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfilePasswordService from '@modules/users/services/UpdateProfilePasswordService';

export default class ProfileController {
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;
      const { old_password, password } = req.body;

      const updatePasswordProfile = container.resolve(
        UpdateProfilePasswordService,
      );

      const user = await updatePasswordProfile.execute({
        user_id,
        old_password,
        password,
      });

      return res.json(classToClass(user));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
