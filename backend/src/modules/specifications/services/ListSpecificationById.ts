import { inject, injectable } from 'tsyringe';

import { Specification } from '../infra/typeorm/entities/Specification';
import { ISpecificationsRepository } from '../repositories/ISpecificationsRepository';

@injectable()
class ListSpecificationById {
  constructor(
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,
  ) {}

  async execute(id: string): Promise<Specification | undefined> {
    const specification = await this.specificationsRepository.findById(id);

    return specification;
  }
}

export { ListSpecificationById };
