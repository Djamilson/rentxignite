import { getRepository, Repository } from 'typeorm';

import IUsersGroupsRepository from '@modules/users/repositories/IUsersGroupsRepository';

import User from '../entities/User';

class UsersGroupsRepository implements IUsersGroupsRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id, {
      relations: ['users_groups', 'user'],
    });

    return user;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default UsersGroupsRepository;
