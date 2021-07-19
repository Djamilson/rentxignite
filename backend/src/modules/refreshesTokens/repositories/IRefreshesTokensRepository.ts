import IByUserIdAndRefreshTokenDTO from '../dtos/IByUserIdAndRefreshTokenDTO';
import ICreateRefreshTokenDTO from '../dtos/ICreateRefreshTokenDTO';
import RefreshToken from '../infra/typeorm/entities/RefreshToken';

export default interface IRefreshesTokensRepository {
  findByIdUserId(user_id: string): Promise<RefreshToken[]>;

  findByUserIdAndRefreshToken(
    byUserIdAndRefreshTokenDTO: IByUserIdAndRefreshTokenDTO,
  ): Promise<RefreshToken | undefined>;

  findRefreshTokenToUserIdInDevice({
    device,
    user_id,
  }: {
    device: string;
    user_id: string;
  }): Promise<RefreshToken[] | undefined>;

  deleteListIds(ids: RefreshToken[]): Promise<void>;

  findById(id: string): Promise<RefreshToken | undefined>;
  create(data: ICreateRefreshTokenDTO): Promise<RefreshToken>;
  save(usersTokensSignIn: RefreshToken): Promise<RefreshToken>;
  delete(id: string): Promise<void>;
}
