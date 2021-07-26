import { sign } from 'jsonwebtoken';
import path from 'path';
import { injectable, inject } from 'tsyringe';
import { uuid } from 'uuidv4';

import IRefreshesTokensRepository from '@modules/refreshesTokens/repositories/IRefreshesTokensRepository';

import authConfig from '@config/auth';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';

import IForgotTokensRepository from '../repositories/IForgotTokensRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('ForgotTokensRepository')
    private forgotTokensRepository: IForgotTokensRepository,

    @inject('RefreshesTokensRepository')
    private refreshesTokensRepository: IRefreshesTokensRepository,

    @inject('DayjsDateProvider')
    private dayjsDateProvider: IDateProvider,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const userExists = await this.usersRepository.findByEmail(email);
    if (!userExists) {
      throw new AppError('User does not exists.');
    }

    const {
      secretForgotToken,
      expiresInForgotToken,
      expiresForgotTokenDays,
    } = authConfig.jwt;

    const forgot_token = sign({ email }, secretForgotToken, {
      subject: userExists.id,
      expiresIn: expiresInForgotToken,
    });

    const forgot_token_expires_date = this.dayjsDateProvider.addDays(
      expiresForgotTokenDays,
    );

    const listRefreshTokensUser = await this.refreshesTokensRepository.findByIdUserId(
      userExists.id,
    );

    if (listRefreshTokensUser && listRefreshTokensUser.length > 0) {
      await this.refreshesTokensRepository.deleteListIds(listRefreshTokensUser);
    }

    const listForgotTokensRepository = await this.forgotTokensRepository.findByUserId(
      userExists.id,
    );

    if (listForgotTokensRepository && listForgotTokensRepository.length > 0) {
      await this.forgotTokensRepository.deleteListIds(
        listForgotTokensRepository,
      );
    }

    const code = uuid().substr(32, 4);

    await this.forgotTokensRepository.create({
      user_id: userExists.id,
      token: forgot_token,
      expires_date: forgot_token_expires_date,
      code,
    });

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: userExists.person.name,
        email: userExists.person.email,
      },
      subject: '[RentalX] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: userExists.person.name,
          link: `${process.env.APP_URL_FRONTEND}/reset_password?token=${forgot_token}`,
          code,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
