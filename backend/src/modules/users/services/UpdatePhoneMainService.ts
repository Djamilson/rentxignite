import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Phone from '../infra/typeorm/entities/Phone';
import IPersonsRepository from '../repositories/IPersonsRepository';
import IPhonesRepository from '../repositories/IPhonesRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  phoneId: string;
  user_id: string;
}

@injectable()
class UpdatePhoneMainService {
  constructor(
    @inject('PhonesRepository')
    private phonesRepository: IPhonesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PersonsRepository')
    private personsRepository: IPersonsRepository,
  ) {}

  public async execute({
    phoneId,
    user_id,
  }: IRequest): Promise<Phone | undefined> {
    const checkPhoneExists = await this.phonesRepository.findById(phoneId);

    if (!checkPhoneExists) {
      throw new AppError('Phone not exist.');
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const { person } = user;
    person.phone_id_main = phoneId;

    await this.personsRepository.save(person);

    return checkPhoneExists;
  }
}

export default UpdatePhoneMainService;
