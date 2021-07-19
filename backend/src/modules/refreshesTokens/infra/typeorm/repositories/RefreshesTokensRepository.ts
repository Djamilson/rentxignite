import { getRepository, Repository } from 'typeorm';

import IByUserIdAndRefreshTokenDTO from '@modules/refreshesTokens/dtos/IByUserIdAndRefreshTokenDTO';
import ICreateRefreshTokenDTO from '@modules/refreshesTokens/dtos/ICreateRefreshTokenDTO';
import IRefreshesTokensRepository from '@modules/refreshesTokens/repositories/IRefreshesTokensRepository';

import RefreshToken from '../entities/RefreshToken';

class RefreshesTokensRepository implements IRefreshesTokensRepository {
  private ormRefreshesTokensRepository: Repository<RefreshToken>;

  constructor() {
    this.ormRefreshesTokensRepository = getRepository(RefreshToken);
  }

  public async findById(id: string): Promise<RefreshToken | undefined> {
    const userTokenSignIn = await this.ormRefreshesTokensRepository.findOne(id);

    return userTokenSignIn;
  }

  public async findByIdUserId(user_id: string): Promise<RefreshToken[]> {
    const refreshesTokenss = await this.ormRefreshesTokensRepository.find({
      user_id,
    });

    return refreshesTokenss;
  }

  public async findByUserIdAndRefreshToken({
    refresh_token,
    user_id,
  }: IByUserIdAndRefreshTokenDTO): Promise<RefreshToken | undefined> {
    const refreshesTokenss = await this.ormRefreshesTokensRepository.findOne({
      user_id,
      refresh_token,
    });

    return refreshesTokenss;
  }

  public async findRefreshTokenToUserIdInDevice({
    device,
    user_id,
  }: {
    device: string;
    user_id: string;
  }): Promise<RefreshToken[] | undefined> {
    const refreshesTokenss = await this.ormRefreshesTokensRepository.find({
      user_id,
      device,
    });

    return refreshesTokenss;
  }

  public async create(
    refreshesTokens: ICreateRefreshTokenDTO,
  ): Promise<RefreshToken> {
    const userToken = this.ormRefreshesTokensRepository.create(refreshesTokens);

    await this.ormRefreshesTokensRepository.save(userToken);

    return userToken;
  }

  public async save(refreshesTokens: RefreshToken): Promise<RefreshToken> {
    return this.ormRefreshesTokensRepository.save(refreshesTokens);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRefreshesTokensRepository.delete(id);
  }

  public async deleteListIds(ids: RefreshToken[]): Promise<void> {
    await this.ormRefreshesTokensRepository.remove(ids);
  }
}

export default RefreshesTokensRepository;
