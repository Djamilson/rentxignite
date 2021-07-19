import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowPersonService from '@modules/users/services/ShowPersonService';

export default class PersonsController {
  public async show(req: Request, res: Response): Promise<Response> {
    try {
      const { personId } = req.params;

      const showPerson = container.resolve(ShowPersonService);

      const person = await showPerson.execute({
        person_id: personId,
      });

      return res.json(classToClass(person));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
