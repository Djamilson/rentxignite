import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileDocumentService from '@modules/users/services/UpdateProfileDocumentService';

export default class ProfileDocumentsController {
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;
      const { old_password, password } = req.body;

      const updateDocumentsProfile = container.resolve(
        UpdateProfileDocumentService,
      );

      const user = await updateDocumentsProfile.execute({
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
