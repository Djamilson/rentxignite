import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdatePhoneMainService from '@modules/users/services/UpdatePhoneMainService';

export default class PhonesController {
  public async put(req: Request, res: Response): Promise<Response> {
    try {
      const { phoneId } = req.params;
      const user_id = req.user.id;

      const upDatePhoneMain = container.resolve(UpdatePhoneMainService);

      const phone = await upDatePhoneMain.execute({
        phoneId,
        user_id,
      });
      return res.json(classToClass(phone));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
