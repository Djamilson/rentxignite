import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { Specification } from '../infra/typeorm/entities/Specification';
import { ISpecificationsRepository } from '../repositories/ISpecificationsRepository';

interface IRequest {
  id: string;
  description: string;
}

@injectable()
class UpdateSpecificationDescriptionService {
  constructor(
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,
  ) {}

  public async execute({ id, description }: IRequest): Promise<Specification> {
    const mySpecification = await this.specificationsRepository.findById(id);

    if (!mySpecification) {
      throw new AppError('Specification not found');
    }

    mySpecification.description = description;

    return this.specificationsRepository.save(mySpecification);
  }
}

export { UpdateSpecificationDescriptionService };
