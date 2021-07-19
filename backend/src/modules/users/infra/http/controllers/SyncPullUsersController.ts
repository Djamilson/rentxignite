import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SyncPullUsersService } from '@modules/users/services/SyncPullUsersService';

class SyncPullUsersController {
  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      console.log('PUSH DO USUÁRIO=!!!');

      const { user_id, name, driver_license, avatar } = req.body;

      const syncPullUser = container.resolve(SyncPullUsersService);

      console.log('PUSH DO USUÁRIO =>>>>');
      const user = await syncPullUser.execute({
        user_id,
        name,
        driver_license,
        avatar,
      });

      console.log('MY RETURN DO USUÁRIO', user);

      return res.status(201).json(user);
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}

export { SyncPullUsersController };
