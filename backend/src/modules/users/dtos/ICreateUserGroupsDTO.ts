import User from '@modules/users/infra/typeorm/entities/User';

import Group from '../infra/typeorm/entities/Group';

export default interface ICreateUserGroupsDTO {
  user: User;
  group: Group;
}
