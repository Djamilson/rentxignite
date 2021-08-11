import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
// import * as jwt from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';
import AppErrorAuth from '@shared/errors/AppErrorAuth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppErrorAuth('Token not present', 'token.invalid', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    if (!token) {
      throw new AppErrorAuth('Token not present', 'token.invalid', 401);
    }

    const decoded = verify(token, authConfig.jwt.secretToken);

    const { sub: user_id } = decoded as ITokenPayload;

    request.user = {
      id: user_id,
    };

    return next();
  } catch (err) {
    if (err && err.name === 'TokenExpiredError') {
      throw new AppError(err, 401);
    }

    throw new AppError('Token invalid.', 401);
  }
}
