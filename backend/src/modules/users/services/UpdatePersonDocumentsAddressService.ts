import { parse } from 'date-fns';
import { inject, injectable, container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Person from '../infra/typeorm/entities/Person';
import IPersonsRepository from '../repositories/IPersonsRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import CreateAddressService from './CreateAddressService';

interface IRequest {
  user_id: string;
  cpf: string;
  birdthDate: string;
  rg: string;
  rgss: string;

  number: string;
  street: string;
  complement: string;
  neighborhood: string;
  zip_code: string;
  city_id: string;
}

@injectable()
class UpdatePersonDocumentsAddressService {
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

    number,
    street,
    complement,
    neighborhood,
    zip_code,
    city_id,
  }: IRequest): Promise<Person> {
    const newBirdthDate = parse(birdthDate, 'dd/MM/yyyy', new Date());

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const createAddress = container.resolve(CreateAddressService);

    const newAddres = await createAddress.execute({
      number: Number(number),
      street,
      complement,
      zip_code,
      neighborhood,
      user_id,
      city_id,
    });

    console.log('newAddres .....', newAddres);

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

export default UpdatePersonDocumentsAddressService;
