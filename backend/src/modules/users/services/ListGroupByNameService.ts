import { inject, injectable } from 'tsyringe';

import IGroupsRepository from '@modules/users/repositories/IGroupsRepository';

import AppError from '@shared/errors/AppError';

import Group from '../infra/typeorm/entities/Group';

@injectable()
class ListGroupByNameService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
  ) {}

  public async execute(name: string): Promise<Group | undefined> {
    const groupExists = await this.groupsRepository.findByName(name);

    if (!groupExists) {
      throw new AppError('There not find any group with the givan id');
    }

    return groupExists;
  }
}

export default ListGroupByNameService;
