import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import IRefreshesTokensRepository from '@modules/refreshesTokens/repositories/IRefreshesTokensRepository';

import authConfig from '@config/auth';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IGroupsRepository from '../repositories/IGroupsRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
  device: string;
}
interface IGroup {
  id: string;
  name: string;
  description: string;
}
interface IUserSerializable {
  id: string;
  is_verified: boolean;
  roles: string[];
  person: {
    id: string;
    name: string;
    email: string;
    status: boolean;
    privacy: boolean;
    avatar?: string;
    avatar_url?: () => string | null;
  };
}

interface IResponse {
  user: IUserSerializable;
  token: string;
  refreshToken?: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('RefreshesTokensRepository')
    private refreshesTokensRepository: IRefreshesTokensRepository,

    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('DayjsDateProvider')
    private dayjsDateProvider: IDateProvider,
  ) {}

  public async execute({
    email,
    password,
    device,
  }: IRequest): Promise<IResponse> {
    const userOut = await this.usersRepository.findByEmail(email);

    if (!userOut) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      userOut.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 402);
    }

    const groups = userOut.user_groups.map(group => {
      return { id: group.group_id };
    });

    const listgroup = await this.groupsRepository.findAllById(groups);

    const roles = listgroup?.map(role => {
      return role.description;
    });

    const {
      secretToken,
      secretRefreshToken,
      expiresInToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
    } = authConfig.jwt;

    const token = sign({ roles }, secretToken, {
      subject: userOut.id,
      expiresIn: expiresInToken,
    });

    const refresh_token = sign({ email }, secretRefreshToken, {
      subject: userOut.id,
      expiresIn: expiresInRefreshToken,
    });

    const refresh_token_expires_date = this.dayjsDateProvider.addDays(
      expiresRefreshTokenDays,
    );

    const listRefreshTokensUser = await this.refreshesTokensRepository.findRefreshTokenToUserIdInDevice(
      { user_id: userOut.id, device },
    );

    if (listRefreshTokensUser && listRefreshTokensUser.length > 0) {
      await this.refreshesTokensRepository.deleteListIds(listRefreshTokensUser);
    }

    await this.refreshesTokensRepository.create({
      user_id: userOut.id,
      refresh_token,
      expires_date: refresh_token_expires_date,
      device,
    });

    const user = {
      id: userOut.id,
      is_verified: userOut.is_verified,
      roles,
      firstName: userOut.person.name.split(' ')[0],

      person: {
        id: userOut.person.id,
        name: userOut.person.name,
        email: userOut.person.email,
        status: userOut.person.status,
        privacy: userOut.person.privacy,
        avatar: userOut.person.avatar,
        phone_id_main: userOut.person.phone_id_main,
        address_id_main: userOut.person.address_id_main,
        avatar_url: userOut.person.getAvatarUrl,
        driver_license: userOut?.person?.driver_license,
      },
    };

    return {
      user,
      token,
      refreshToken: refresh_token,
    };
  }
}

export default AuthenticateUserService;
