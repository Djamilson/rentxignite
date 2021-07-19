import { injectable, inject } from 'tsyringe';

// import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IPersonsRepository from '../repositories/IPersonsRepository';
import IPhonesRepository from '../repositories/IPhonesRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  phone: string;
  user_id: string;
}
interface IPhone {
  id: string;
  phone: string;
  person_id: string;
  main: boolean;
}
@injectable()
class CreatePhoneService {
  constructor(
    @inject('PhonesRepository')
    private phonesRepository: IPhonesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PersonsRepository')
    private personsRepository: IPersonsRepository,
  ) {}

  public async execute({ phone, user_id }: IRequest): Promise<IPhone> {
    const checkUserExists = await this.usersRepository.findById(user_id);

    if (!checkUserExists) {
      throw new AppError('User not exists.');
    }

    const { person_id } = checkUserExists;

    const checkPhoneExists = await this.phonesRepository.findByPhone({
      phone,
      person_id,
    });

    if (checkPhoneExists) {
      throw new AppError('Phone already used.');
    }

    const { person } = checkUserExists;

    const phoneSerealizable = {
      phone,
      person_id,
    };

    const newPhone = await this.phonesRepository.create(phoneSerealizable);

    const serealizablePhone = {
      id: newPhone.id,
      phone: newPhone.phone,
      person_id: newPhone.person_id,
      main: true,
    };

    person.phone_id_main = newPhone.id;

    await this.personsRepository.save(person);

    return serealizablePhone;
  }
}

export default CreatePhoneService;
