import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Phone from '../infra/typeorm/entities/Phone';
import IPhonesRepository from '../repositories/IPhonesRepository';

interface IRequest {
  person_id: string;
  id: string;
  phone: string;
}

@injectable()
class UpdatePhoneService {
  constructor(
    @inject('PhonesRepository')
    private phonesRepository: IPhonesRepository,
  ) {}

  public async execute({ id, phone, person_id }: IRequest): Promise<Phone> {
    const checkPhoneExists = await this.phonesRepository.findByPhone({
      phone,
      person_id,
    });

    if (checkPhoneExists) {
      throw new AppError('Phone already used.');
    }

    const myPhone = await this.phonesRepository.findById(id);

    if (!myPhone) {
      throw new AppError('Phone not found');
    }

    myPhone.phone = phone;

    return this.phonesRepository.save(myPhone);
  }
}

export default UpdatePhoneService;
