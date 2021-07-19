import { getRepository, Repository } from 'typeorm';

import IUsersRefleshTokensRepository from '@modules/users/repositories/IUsersRefleshTokensRepository';

import ICreateUserRefleshTokenDTO from '../../../dtos/ICreateUserRefleshTokenDTO';
import UserRefleshToken from '../entities/UserRefleshToken';

class UsersRefleshTokensRepository implements IUsersRefleshTokensRepository {
  private ormRepository: Repository<UserRefleshToken>;

  constructor() {
    this.ormRepository = getRepository(UserRefleshToken);
  }

  public async create(
    refleshToken: ICreateUserRefleshTokenDTO,
  ): Promise<UserRefleshToken> {
    const newRefleshToken = this.ormRepository.create(refleshToken);

    await this.ormRepository.save(newRefleshToken);

    return newRefleshToken;
  }

  public async save(refleshToken: UserRefleshToken): Promise<UserRefleshToken> {
    return this.ormRepository.save(refleshToken);
  }

  public async findByToken(
    token: string,
  ): Promise<UserRefleshToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }
}

export default UsersRefleshTokensRepository;
