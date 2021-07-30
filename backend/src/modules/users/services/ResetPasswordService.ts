import { verify } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IForgotTokensRepository from '../repositories/IForgotTokensRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ForgotTokensRepository')
    private forgotTokensRepository: IForgotTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    try {
      const userToken = await this.forgotTokensRepository.findByToken(token);

      if (!userToken) {
        throw new AppError('User token does not exists');
      }

      verify(userToken.token, authConfig.jwt.secretForgotToken);

      const user = await this.usersRepository.findById(userToken.user_id);

      if (!user) {
        throw new AppError('User token does not exists');
      }

      user.password = await this.hashProvider.generateHash(password);

      await this.usersRepository.save(user);

      return this.forgotTokensRepository.delete(userToken.id);
    } catch (err) {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          throw new AppError('token.invalid!', 401);
        }
      }
      throw new AppError('Token invalid.', 401);
    }
  }
}

export default ResetPasswordService;
