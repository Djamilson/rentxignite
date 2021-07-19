import { parse } from 'date-fns';
import { inject, injectable, container } from 'tsyringe';

import CreatePhoneService from '@modules/users/services/CreatePhoneService';

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
  phone: string;
}

@injectable()
class UpdatePersonDocumentsPhoneService {
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

    phone,
  }: IRequest): Promise<Person> {
    console.log('My Phone:', phone);
    const newBirdthDate = parse(birdthDate, 'dd/MM/yyyy', new Date());

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const createPhone = container.resolve(CreatePhoneService);

    await createPhone.execute({
      phone,
      user_id,
    });

    const newUser = await this.usersRepository.findById(user_id);

    if (!newUser) {
      throw new AppError('User not found');
    }

    newUser.person.cpf = cpf;
    newUser.person.rg = rg;
    newUser.person.rgss = rgss;
    newUser.person.birdth_date = newBirdthDate;

    return this.personsRepository.save(newUser.person);
  }
}

export default UpdatePersonDocumentsPhoneService;
