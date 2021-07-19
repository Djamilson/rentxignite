import { getRepository, Repository } from 'typeorm';

import IUpdatePersonDTO from '@modules/users/dtos/IUpdatePersonDTO';
import IPersonsRepository from '@modules/users/repositories/IPersonsRepository';

import Person from '../entities/Person';

class PersonsRepository implements IPersonsRepository {
  private ormPersonRepository: Repository<Person>;

  constructor() {
    this.ormPersonRepository = getRepository(Person);
  }

  public async findById(id: string): Promise<Person | undefined> {
    const person = await this.ormPersonRepository.findOne(id, {
      relations: ['phone'],
    });

    return person;
  }

  public async create(person: IUpdatePersonDTO): Promise<Person> {
    const newPerson = this.ormPersonRepository.create(person);

    await this.ormPersonRepository.save(newPerson);

    return newPerson;
  }

  public async save(person: Person): Promise<Person> {
    return this.ormPersonRepository.save(person);
  }

  public async delete(id: string): Promise<void> {
    await this.ormPersonRepository.delete(id);
  }
}

export default PersonsRepository;
