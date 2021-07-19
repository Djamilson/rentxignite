import { inject, injectable } from 'tsyringe';

import Address from '../infra/typeorm/entities/Address';
import IAddressesRepository from '../repositories/IAddressesRepository';

interface IRequest {
  id: string;
}

@injectable()
class FindAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Address | undefined> {
    const address = await this.addressesRepository.findById(id);

    return address;
  }
}

export default FindAddressService;
