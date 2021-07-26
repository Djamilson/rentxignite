import ICreateForgotTokenDTO from '../dtos/ICreateForgotTokenDTO';
import { ForgotToken } from '../infra/typeorm/entities/ForgotToken';

export default interface IForgotTokensRepository {
  findByToken(token: string): Promise<ForgotToken | undefined>;
  findByCode(code: string): Promise<ForgotToken | undefined>;

  findByUserId(user_id: string): Promise<ForgotToken[] | undefined>;
  deleteListIds(ids: ForgotToken[]): Promise<void>;
  delete(id: string): Promise<void>;

  create(forgotToken: ICreateForgotTokenDTO): Promise<ForgotToken>;
  save(forgotToken: ForgotToken): Promise<ForgotToken>;
}
