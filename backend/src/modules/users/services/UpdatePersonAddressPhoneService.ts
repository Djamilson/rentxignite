import { inject, injectable, container } from 'tsyringe';

import CreatePhoneService from '@modules/users/services/CreatePhoneService';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import CreateAddressService from './CreateAddressService';

interface IProps {
  address_id_main: string;
  phone_id_main: string;
}
interface IRequest {
  user_id: string;

  number: string;
  street: string;
  complement: string;
  neighborhood: string;
  zip_code: string;
  city_id: string;

  phone: string;
}

@injectable()
class UpdatePersonAddressPhoneService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    number,
    street,
    complement,
    neighborhood,
    zip_code,
    city_id,

    phone,
  }: IRequest): Promise<IProps> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const createPhone = container.resolve(CreatePhoneService);
    const createAddress = container.resolve(CreateAddressService);

    const newPhone = await createPhone.execute({
      phone,
      user_id,
    });

    const newAddres = await createAddress.execute({
      number: Number(number),
      street,
      complement,
      zip_code,
      neighborhood,
      user_id,
      city_id,
    });

    return { phone_id_main: newPhone.id, address_id_main: newAddres.id };
  }
}

export default UpdatePersonAddressPhoneService;
