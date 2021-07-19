import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import ListGroupByNameService from '@modules/users/services/ListGroupByNameService';
import ShowUserService from '@modules/users/services/ShowUserService';

import AppError from '@shared/errors/AppError';

export default class UsersController {
  public async show(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      if (user_id !== req.params.userId) {
        throw new AppError('Incorrect email/password combination.', 402);
      }

      const showUser = container.resolve(ShowUserService);

      const userLogado = await showUser.execute({
        user_id,
      });
      return res.json(classToClass(userLogado));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, nameGroup } = req.body;

      const createUser = container.resolve(CreateUserService);
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
      });

      return res.json(classToClass(user));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
