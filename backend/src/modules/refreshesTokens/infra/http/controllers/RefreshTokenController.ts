import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateRefreshTokenService from '@modules/refreshesTokens/services/CreateRefreshTokenService';

export default class RefreshTokenController {
  public async handle(req: Request, res: Response): Promise<Response> {
    const token =
      req.body.token || req.headers['x-access-token'] || req.query.token;

    const { device } = req.body;

    const createRefreshToken = container.resolve(CreateRefreshTokenService);

    const refreshToken = await createRefreshToken.execute({ token, device });

    return res.json(classToClass(refreshToken));
  }
}
