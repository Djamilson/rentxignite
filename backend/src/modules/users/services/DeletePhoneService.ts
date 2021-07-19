import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IPhonesRepository from '../repositories/IPhonesRepository';

interface IRequest {
  idPhone: string;
}

@injectable()
class DeletePhoneService {
  constructor(
    @inject('PhonesRepository')
    private phonesRepository: IPhonesRepository,
  ) {}

  public async execute({ idPhone }: IRequest): Promise<void> {
    const checkPhoneExists = await this.phonesRepository.findById(idPhone);

    if (!checkPhoneExists) {
      throw new AppError('Phone does not exist.');
    }

    await this.phonesRepository.delete(checkPhoneExists.id);
  }
}

export default DeletePhoneService;
