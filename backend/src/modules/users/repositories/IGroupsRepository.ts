import ICreateGroupDTO from '../dtos/ICreateGroupDTO';
import Group from '../infra/typeorm/entities/Group';

interface IFindGroups {
  id: string;
}

export default interface IGroupsRepository {
  findById(id: string): Promise<Group | undefined>;
  findAllById(groups: IFindGroups[]): Promise<Group[]>;
  findByName(name: string): Promise<Group | undefined>;
  create(data: ICreateGroupDTO): Promise<Group>;
  save(group: Group): Promise<Group>;
}
