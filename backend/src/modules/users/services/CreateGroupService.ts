import { injectable, inject } from 'tsyringe';

import IGroupsRepository from '@modules/users/repositories/IGroupsRepository';

import AppError from '@shared/errors/AppError';

import Group from '../infra/typeorm/entities/Group';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
  ) {}

  public async execute({ name, description }: IRequest): Promise<Group> {
    const checkGroupExists = await this.groupsRepository.findByName(name);

    if (checkGroupExists) {
      throw new AppError('Group already used.');
    }

    const group = this.groupsRepository.create({
      name,
      description,
    });

    return group;
  }
}

export default CreateGroupService;
