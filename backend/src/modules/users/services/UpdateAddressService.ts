import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICitiesRepository from '../../locality/repositories/ICitiesRepository';
import Address from '../infra/typeorm/entities/Address';
import IAddressesRepository from '../repositories/IAddressesRepository';

interface IRequest {
  id: string;
  number: number;
  street: string;
  complement: string;
  zip_code: string;
  neighborhood: string;
  city_id: string;
}

@injectable()
class UpdateAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('CitiesRepository')
    private citiesRepository: ICitiesRepository,
  ) {}

  public async execute({
    id,
    number,
    street,
    complement,
    zip_code,
    neighborhood,
    city_id,
  }: IRequest): Promise<Address | undefined> {
    const checkAddressExists = await this.addressesRepository.findById(id);

    if (!checkAddressExists) {
      throw new AppError('Address not exist.');
    }

    const cityExists = await this.citiesRepository.findById(city_id);

    if (!cityExists) {
      throw new AppError('Address not exist.');
    }

    checkAddressExists.number = number;
    checkAddressExists.street = street;
    checkAddressExists.complement = complement;
    checkAddressExists.zip_code = zip_code;
    checkAddressExists.neighborhood = neighborhood;
    checkAddressExists.city = cityExists;

    await this.addressesRepository.save(checkAddressExists);

    return checkAddressExists;
  }
}

export default UpdateAddressService;
