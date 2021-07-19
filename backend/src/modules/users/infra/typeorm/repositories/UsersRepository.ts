import { getRepository, Repository } from 'typeorm';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import Person from '../entities/Person';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormUserRepository: Repository<User>;

  private ormPersonRepository: Repository<Person>;

  constructor() {
    this.ormUserRepository = getRepository(User);
    this.ormPersonRepository = getRepository(Person);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormUserRepository.findOne(id, {
      relations: ['person', 'user_groups', 'user_groups.group'],
    });

    return user;
  }

  public async findByIdInfoUser(user_id: string): Promise<User | undefined> {
    const user = await this.ormUserRepository.findOne(user_id, {
      relations: ['person', 'user_groups', 'user_groups.group'],
    });

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const person = await this.ormPersonRepository.findOne({
      where: { email },
    });

    let user;

    if (person) {
      user = await this.ormUserRepository.findOne({
        where: { person_id: person.id },
        relations: ['person'],
      });
    }

    return user;
  }

  public async findByDriverLicense(
    driver_license: string,
  ): Promise<User | undefined> {
    const person = await this.ormPersonRepository.findOne({
      where: { driver_license },
    });

    let user;

    if (person) {
      user = await this.ormUserRepository.findOne({
        where: { person_id: person.id },
        relations: ['person'],
      });
    }

    return user;
  }

  public async create(user: ICreateUserDTO): Promise<User> {
    const newUser = this.ormUserRepository.create(user);

    await this.ormUserRepository.save(newUser);

    return newUser;
  }

  public async save(user: User): Promise<User> {
    return this.ormUserRepository.save(user);
  }

  public async delete(id: string): Promise<void> {
    await this.ormUserRepository.delete(id);
  }
}

export default UsersRepository;
