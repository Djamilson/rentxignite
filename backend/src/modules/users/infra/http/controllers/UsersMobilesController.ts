import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserMobileService from '@modules/users/services/CreateUserMobileService';
import ListGroupByNameService from '@modules/users/services/ListGroupByNameService';

import AppError from '@shared/errors/AppError';

class UsersMobilesController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, nameGroup, driver_license } = req.body;

      const createUser = container.resolve(CreateUserMobileService);
      const listGroupByNameService = container.resolve(ListGroupByNameService);

      const groupExist = await listGroupByNameService.execute(nameGroup);

      if (!groupExist) {
        throw new AppError('There not find any group with the givan id');
      }

      const groups = [{ id: groupExist.id }];

      const user = await createUser.execute({
        name,
        email,
        password,
        groups,
        driver_license,
      });

      return res.json(classToClass(user));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}

export { UsersMobilesController };
