import { verify } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';
import AppErrorAuth from '@shared/errors/AppErrorAuth';

import IForgotTokensRepository from '../repositories/IForgotTokensRepository';

interface IRequest {
  code: string;
}

interface IObject {
  user_id: string;
}

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

@injectable()
class ValidationCodeService {
  constructor(
    @inject('ForgotTokensRepository')
    private forgotTokensRepository: IForgotTokensRepository,
  ) {}

  public async execute({ code }: IRequest): Promise<IObject> {
    try {
      const userToken = await this.forgotTokensRepository.findByCode(code);

      if (!userToken) {
        throw new AppError('User token does not exists', 401);
      }

      const decoded = verify(userToken.token, authConfig.jwt.secretForgotToken);
      const { sub: user_id } = decoded as ITokenPayload;

      return { user_id };
    } catch (err) {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          throw new AppError('token.invalid!', 401);
        }
      }
      throw new AppErrorAuth('Token invalid.', 'token.invalid', 401);
    }
  }
}

export default ValidationCodeService;
