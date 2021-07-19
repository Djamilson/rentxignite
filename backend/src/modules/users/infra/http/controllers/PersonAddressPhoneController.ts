import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdatePersonAddressPhoneService from '@modules/users/services/UpdatePersonAddressPhoneService';

export default class PersonAddressPhoneController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const updatePerson = container.resolve(UpdatePersonAddressPhoneService);

      const person = await updatePerson.execute({ user_id, ...req.body });

      return res.json(classToClass(person));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
