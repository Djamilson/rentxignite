import { sign, verify } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

// import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IRefreshesTokensRepository from '@modules/refreshesTokens/repositories/IRefreshesTokensRepository';
import IGroupsRepository from '@modules/users/repositories/IGroupsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import authConfig from '@config/auth';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import AppError from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

interface IUserSerializable {
  id?: string;
  is_verified?: boolean;
  roles?: string[];
  firstName?: string;
  person: {
    phone_id_main?: string;
    address_id_main?: string;
    id?: string;
    name?: string;
    email?: string;
    status?: boolean;
    privacy?: boolean;
    avatar?: string;
    avatar_url?: () => string | null;
  };
}

interface ITokenResponse {
  user: IUserSerializable;
  token: string;
  refreshToken: string;
}

interface IRequest {
  token: string;
  device: string;
}
@injectable()
class CreateRefreshTokenService {
  constructor(
    @inject('RefreshesTokensRepository')
    private refreshesTokensRepository: IRefreshesTokensRepository,

    @inject('DayjsDateProvider')
    private dayjsDateProvider: IDateProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
  ) {}

  public async execute({ token, device }: IRequest): Promise<ITokenResponse> {
    const {
      secretToken,
      expiresInToken,
      expiresInRefreshToken,
      secretRefreshToken,
      expiresRefreshTokenDays,
    } = authConfig.jwt;

    const { email, sub } = verify(token, secretRefreshToken) as IPayload;

    const user_id = sub;

    const userToken = await this.refreshesTokensRepository.findByUserIdAndRefreshToken(
      {
        user_id,
        refresh_token: token,
      },
    );

    if (!userToken) {
      throw new AppError('Refresh Token does not exists!');
    }

    const listRefreshTokensUser = await this.refreshesTokensRepository.findRefreshTokenToUserIdInDevice(
      { user_id, device },
    );

    if (listRefreshTokensUser && listRefreshTokensUser.length > 0) {
      await this.refreshesTokensRepository.deleteListIds(listRefreshTokensUser);
    }

    const userOut = await this.usersRepository.findByEmail(email);

    const groups = userOut?.user_groups.map(group => {
      return { id: group.group_id };
    });

    let listgroup;
    let roles;

    if (groups) {
      listgroup = await this.groupsRepository.findAllById(groups);

      roles = listgroup?.map(role => {
        return role.description;
      });
    }

    const newToken = sign({ roles }, secretToken, {
      subject: user_id,
      expiresIn: expiresInToken,
    });

    const refresh_token = sign({ email }, secretRefreshToken, {
      subject: user_id,
      expiresIn: expiresInRefreshToken,
    });

    const refresh_token_expires_date = this.dayjsDateProvider.addDays(
      expiresRefreshTokenDays,
    );

    await this.refreshesTokensRepository.create({
      user_id,
      refresh_token,
      expires_date: refresh_token_expires_date,
      device,
    });

    const user = {
      id: user_id,
      is_verified: userOut?.is_verified,
      roles,
      firstName: userOut?.person.name.split(' ')[0],

      person: {
        id: userOut?.person.id,
        name: userOut?.person.name,
        email: userOut?.person.email,
        status: userOut?.person.status,
        privacy: userOut?.person.privacy,
        avatar: userOut?.person.avatar,
        phone_id_main: userOut?.person.phone_id_main,
        address_id_main: userOut?.person.address_id_main,
        avatar_url: userOut?.person.getAvatarUrl,
        driver_license: userOut?.person?.driver_license,
      },
    };

    return { user, refreshToken: refresh_token, token: newToken };
  }
}

export default CreateRefreshTokenService;
