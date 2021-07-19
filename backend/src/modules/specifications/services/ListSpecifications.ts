import { inject, injectable } from 'tsyringe';

import { Specification } from '@modules/specifications/infra/typeorm/entities/Specification';

import { ISpecificationsRepository } from '../repositories/ISpecificationsRepository';

@injectable()
class ListSpecifications {
  constructor(
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,
  ) {}

  async execute(): Promise<Specification[]> {
    const Specifications = await this.specificationsRepository.listAll();

    return Specifications;
  }
}

export { ListSpecifications };
