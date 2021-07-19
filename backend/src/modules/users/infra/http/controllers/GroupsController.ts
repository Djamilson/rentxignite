import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateGroupService from '@modules/users/services/CreateGroupService';

export default class GroupController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description } = req.body;
      const createGroup = container.resolve(CreateGroupService);

      const group = await createGroup.execute({ name, description });

      return res.json(classToClass(group));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
