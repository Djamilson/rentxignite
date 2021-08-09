import { getRepository, Repository } from 'typeorm';

import { ICreateRegulationDTO } from '@modules/regulations/dtos/ICreateRegulationDTO';
import { IRegulationsRepository } from '@modules/regulations/repositories/IRegulationsRepository';

import { Regulation } from '../entities/Regulation';

class RegulationsRepository implements IRegulationsRepository {
  private repository: Repository<Regulation>;

  constructor() {
    this.repository = getRepository(Regulation);
  }

  async findById(id: string): Promise<Regulation | undefined> {
    const rental = await this.repository.findOne(id);

    return rental;
  }

  async findAll(): Promise<Regulation[]> {
    const regulations = await this.repository.find();
    return regulations;
  }

  public async create(rental: ICreateRegulationDTO): Promise<Regulation> {
    const newRegulation = this.repository.create(rental);

    await this.repository.save(newRegulation);

    return newRegulation;
  }

  public async save(rental: Regulation): Promise<Regulation> {
    return this.repository.save(rental);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { RegulationsRepository };
