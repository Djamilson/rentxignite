import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import { Regulation } from '../infra/typeorm/entities/Regulation';
import { IRegulationsRepository } from '../repositories/IRegulationsRepository';

interface IRequest {
  regulation: string;
}

@injectable()
class CreateRegulationService {
  constructor(
    @inject('RegulationsRepository')
    private regulationsRepository: IRegulationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute({ regulation }: IRequest): Promise<Regulation | undefined> {
    const myRegulation = await this.regulationsRepository.create({
      regulation,
    });

    const cachekey = `regulations`;

    await this.cacheProvider.invalidate(cachekey);

    return myRegulation;
  }
}

export { CreateRegulationService };
