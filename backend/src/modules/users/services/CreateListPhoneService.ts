import { injectable, inject } from 'tsyringe';

// import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Phone from '../infra/typeorm/entities/Phone';
import IPhonesRepository from '../repositories/IPhonesRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IPhone {
  phone: string;
}

interface IRequest {
  phones: IPhone[];
  user_id: string;
}

@injectable()
class CreatePhoneService {
  constructor(
    @inject('PhonesRepository')
    private phonesRepository: IPhonesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ phones, user_id }: IRequest): Promise<Phone[]> {
    const checkUserExists = await this.usersRepository.findById(user_id);

    if (!checkUserExists) {
      throw new AppError('User not exists.');
    }
    const { person_id } = checkUserExists;

    const phoneSerealizable = phones.map((phone: IPhone) => {
      return {
        ...phone,
        person_id,
      };
    });

    const listPhone = this.phonesRepository.createListPhone(phoneSerealizable);

    return listPhone;
  }
}

export default CreatePhoneService;
