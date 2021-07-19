import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Address from '../infra/typeorm/entities/Address';
import IAddressesRepository from '../repositories/IAddressesRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IState {
  id: string;
  name: string;
}

interface ICity {
  id: string;
  name: string;
  state: IState;
}

export interface IAddress {
  id: string;
  number: number;
  street: string;
  complement: string;
  zip_code: string;
  neighborhood: string;
  person_id: string;
  city: string;
  state: string;
  main: boolean;
}

@injectable()
class ListAddressesService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute(user_id: string): Promise<IAddress[] | undefined> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError('There not find any user with the givan id');
    }

    const listAddresses = await this.addressesRepository.findAllAddressesToPerson(
      userExists.person_id,
    );

    const serializableAddresses = listAddresses?.map((address: Address) => {
      const {
        id,
        number,
        street,
        complement,
        zip_code,
        neighborhood,
        person_id,
        city,
      } = address;

      if (address.id === userExists.person.address_id_main) {
        return {
          id,
          number,
          street,
          complement,
          zip_code,
          neighborhood,
          person_id,
          city: city.name,
          state: city.state.acronym,
          main: true,
        };
      }
      return {
        id,
        number,
        street,
        complement,
        zip_code,
        neighborhood,
        person_id,
        city: city.name,
        state: city.state.acronym,
        main: false,
      };
    });

    return serializableAddresses;
  }
}

export default ListAddressesService;
