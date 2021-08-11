import { inject, injectable } from 'tsyringe';

import { Regulation } from '../infra/typeorm/entities/Regulation';
import { IRegulationsRepository } from '../repositories/IRegulationsRepository';

@injectable()
class ListRegulationService {
  constructor(
    @inject('RegulationsRepository')
    private rentalsRepository: IRegulationsRepository,
  ) {}

  async execute(): Promise<Regulation | undefined> {
    const regulation = await this.rentalsRepository.findAll();

    return regulation && regulation[0];
  }
}

export { ListRegulationService };
