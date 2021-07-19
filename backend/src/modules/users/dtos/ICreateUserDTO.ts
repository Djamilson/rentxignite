import Group from '../infra/typeorm/entities/Group';

interface IGroup {
  group: Group;
}

interface IPerson {
  name: string;
  email: string;
  status: boolean;
}

export default interface ICreateUserDTO {
  person: IPerson;
  password: string;
  user_groups: IGroup[];
}
