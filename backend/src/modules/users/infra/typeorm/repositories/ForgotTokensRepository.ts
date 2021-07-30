import { getRepository, Repository } from 'typeorm';

import ICreateForgotTokenDTO from '@modules/users/dtos/ICreateForgotTokenDTO';
import IForgotTokensRepository from '@modules/users/repositories/IForgotTokensRepository';

import { ForgotToken } from '../entities/ForgotToken';

class ForgotTokensRepository implements IForgotTokensRepository {
  private ormRepository: Repository<ForgotToken>;

  constructor() {
    this.ormRepository = getRepository(ForgotToken);
  }

  public async findByToken(token: string): Promise<ForgotToken | undefined> {
    const forgotToken = await this.ormRepository.findOne({
      where: { token },
    });

    return forgotToken;
  }

  public async findByCode(code: string): Promise<ForgotToken | undefined> {
    const forgotToken = await this.ormRepository.findOne({
      where: { code },
    });

    return forgotToken;
  }

  public async findByUserId(
    user_id: string,
  ): Promise<ForgotToken[] | undefined> {
    const forgotToken = await this.ormRepository.find({
      where: { user_id },
    });

    return forgotToken;
  }

  public async create(
    forgotToken: ICreateForgotTokenDTO,
  ): Promise<ForgotToken> {
    const newToken = this.ormRepository.create(forgotToken);

    await this.ormRepository.save(newToken);

    return newToken;
  }

  public async save(forgotToken: ForgotToken): Promise<ForgotToken> {
    return this.ormRepository.save(forgotToken);
  }

  public async deleteListIds(ids: ForgotToken[]): Promise<void> {
    await this.ormRepository.remove(ids);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default ForgotTokensRepository;
