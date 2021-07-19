import ICreateUserRefleshTokenDTO from '../dtos/ICreateUserRefleshTokenDTO';
import UserRefleshToken from '../infra/typeorm/entities/UserRefleshToken';

export default interface IUsersRefleshTokensRepository {
  save(refleshToken: UserRefleshToken): Promise<UserRefleshToken>;

  create(data: ICreateUserRefleshTokenDTO): Promise<UserRefleshToken>;
  findByToken(token: string): Promise<UserRefleshToken | undefined>;
}
