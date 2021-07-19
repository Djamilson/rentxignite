import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateDocumentService from '@modules/users/services/UpdateDocumentService';

export default class DocumentsController {
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;
      const { cpf, birdthDate, rg, rgss } = req.body;

      console.log('req.body:', req.body);

      const updatePerson = container.resolve(UpdateDocumentService);

      const person = await updatePerson.execute({
        user_id,
        cpf,
        birdthDate,
        rg,
        rgss,
      });

      return res.json(classToClass(person));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
