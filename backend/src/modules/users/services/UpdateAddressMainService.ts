import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Address from '../infra/typeorm/entities/Address';
import IAddressesRepository from '../repositories/IAddressesRepository';
import IPersonsRepository from '../repositories/IPersonsRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  addressId: string;
  user_id: string;
}

@injectable()
class UpdateAddressMainService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PersonsRepository')
    private personsRepository: IPersonsRepository,
  ) {}

  public async execute({
    addressId,
    user_id,
  }: IRequest): Promise<Address | undefined> {
    const checkAddressExists = await this.addressesRepository.findById(
      addressId,
    );

    if (!checkAddressExists) {
      throw new AppError('Address not exist.');
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const { person } = user;
    person.address_id_main = addressId;

    await this.personsRepository.save(person);

    return checkAddressExists;
  }
}

export default UpdateAddressMainService;
