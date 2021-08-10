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
    const word_count = regulation.split(' ').length;
    const average_words_per_minute = 200;

    const reading_time = Math.ceil(word_count / average_words_per_minute);

    const myRegulation = await this.regulationsRepository.create({
      regulation,
      reading_time,
    });

    const cachekey = `regulations`;

    await this.cacheProvider.invalidate(cachekey);

    return myRegulation;
  }
}

export { CreateRegulationService };
