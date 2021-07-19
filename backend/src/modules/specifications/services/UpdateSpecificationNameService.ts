import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { Specification } from '../infra/typeorm/entities/Specification';
import { ISpecificationsRepository } from '../repositories/ISpecificationsRepository';

interface IRequest {
  id: string;
  name: string;
}

@injectable()
class UpdateSpecificationNameService {
  constructor(
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,
  ) {}

  public async execute({ id, name }: IRequest): Promise<Specification> {
    const checkSpecificationExists = await this.specificationsRepository.findByName(
      name,
    );

    if (checkSpecificationExists) {
      throw new AppError('Specification already used.');
    }

    const mySpecification = await this.specificationsRepository.findById(id);

    if (!mySpecification) {
      throw new AppError('Specification not found');
    }

    mySpecification.name = name;

    return this.specificationsRepository.save(mySpecification);
  }
}

export { UpdateSpecificationNameService };
