import { parse } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Person from '../infra/typeorm/entities/Person';
import IPersonsRepository from '../repositories/IPersonsRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  cpf: string;
  birdthDate: string;
  rg: string;
  rgss: string;
  address_id_main: string;
  phone_id_main: string;
}

@injectable()
class UpdatePersonService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PersonsRepository')
    private personsRepository: IPersonsRepository,
  ) {}

  public async execute({
    user_id,
    cpf,
    birdthDate,
    rg,
    rgss,
    address_id_main,
    phone_id_main,
  }: IRequest): Promise<Person> {
    const newBirdthDate = parse(birdthDate, 'dd/MM/yyyy', new Date());

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const { person } = user;

    person.cpf = cpf;
    person.rg = rg;
    person.rgss = rgss;
    person.birdth_date = newBirdthDate;
    person.address_id_main = address_id_main;
    person.phone_id_main = phone_id_main;

    return this.personsRepository.save(person);
  }
}

export default UpdatePersonService;
