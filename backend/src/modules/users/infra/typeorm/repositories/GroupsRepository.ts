import { getRepository, Repository, In } from 'typeorm';

import ICreateGroupDTO from '@modules/users/dtos/ICreateGroupDTO';
import IGroupsRepository from '@modules/users/repositories/IGroupsRepository';

import Group from '../entities/Group';

interface IFindGroups {
  id: string;
}

class GroupsRepository implements IGroupsRepository {
  private ormRepository: Repository<Group>;

  constructor() {
    this.ormRepository = getRepository(Group);
  }

  public async findAllById(groups: IFindGroups[]): Promise<Group[]> {
    const groupIds = groups.map(group => group.id);

    const existsGroups = await this.ormRepository.find({
      where: {
        id: In(groupIds),
      },
      select: ['id', 'name', 'description'],
    });

    return existsGroups;
  }

  public async findById(id: string): Promise<Group | undefined> {
    const group = await this.ormRepository.findOne(id);
    return group;
  }

  public async findByName(name: string): Promise<Group | undefined> {
    const group = await this.ormRepository.findOne({
      where: { name },
    });

    return group;
  }

  public async create(groupData: ICreateGroupDTO): Promise<Group> {
    const group = this.ormRepository.create(groupData);
    await this.ormRepository.save(group);
    return group;
  }

  public async save(group: Group): Promise<Group> {
    return this.ormRepository.save(group);
  }
}

export default GroupsRepository;
