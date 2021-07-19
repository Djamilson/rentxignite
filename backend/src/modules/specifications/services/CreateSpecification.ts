import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { Specification } from '../infra/typeorm/entities/Specification';
import { ISpecificationsRepository } from '../repositories/ISpecificationsRepository';

interface IRequest {
  name: string;
  description: string;
  type: string;
}

@injectable()
class CreateSpecification {
  constructor(
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,
  ) {}

  async execute(data: IRequest): Promise<Specification | undefined> {
    const checkSpecificationExists = await this.specificationsRepository.findByName(
      data.name,
    );

    if (checkSpecificationExists) {
      throw new AppError('Specification already used.');
    }

    return this.specificationsRepository.create(data);
  }
}

export { CreateSpecification };
