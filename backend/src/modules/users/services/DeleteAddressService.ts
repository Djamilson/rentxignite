import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IAddressesRepository from '../repositories/IAddressesRepository';

interface IRequest {
  idAddress: string;
}

@injectable()
class DeleteAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute({ idAddress }: IRequest): Promise<void> {
    const checkAddressExists = await this.addressesRepository.findById(
      idAddress,
    );

    if (!checkAddressExists) {
      throw new AppError('Address does not exist.');
    }

    await this.addressesRepository.delete(checkAddressExists.id);
  }
}

export default DeleteAddressService;
