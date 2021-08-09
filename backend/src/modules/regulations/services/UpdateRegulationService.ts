import { inject, injectable } from 'tsyringe';

import { IRegulationsRepository } from '@modules/regulations/repositories/IRegulationsRepository';

import AppError from '@shared/errors/AppError';

import { Regulation } from '../infra/typeorm/entities/Regulation';

interface IRequest {
  regulation_id: string;
  regulation: string;
}

@injectable()
class UpdateRegulationService {
  constructor(
    @inject('RegulationsRepository')
    private regulationsRepository: IRegulationsRepository,
  ) {}

  public async execute({
    regulation_id,
    regulation,
  }: IRequest): Promise<Regulation> {
    const regulationExists = await this.regulationsRepository.findById(
      regulation_id,
    );

    if (!regulationExists) {
      throw new AppError('Regulation not found');
    }

    regulationExists.regulation = regulation;
    return this.regulationsRepository.save(regulationExists);
  }
}

export { UpdateRegulationService };
