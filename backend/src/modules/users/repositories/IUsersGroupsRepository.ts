import User from '../infra/typeorm/entities/User';

interface ICreateUserGroupsDTO {
  user_id: string;
  group_id: string;
}

export default interface IUsersGroupsRepository {
  findById(id: string): Promise<User | undefined>;
  delete(id: string): Promise<void>;
}
