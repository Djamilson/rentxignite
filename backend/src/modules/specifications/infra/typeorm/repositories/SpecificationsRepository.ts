import { getRepository, Raw, Repository } from 'typeorm';

import { ICreateSpecificationDTO } from '@modules/specifications/dtos/ICreateSpecificationDTO';
import ISpecificationPageDTO from '@modules/specifications/dtos/ISpecificationPageDTO';
import ITotalSpecificationsDTO from '@modules/specifications/dtos/ITotalSpecificationsDTO';

import { ISpecificationsRepository } from '../../../repositories/ISpecificationsRepository';
import { Specification } from '../entities/Specification';

class SpecificationsRepository implements ISpecificationsRepository {
  private repository: Repository<Specification>;

  constructor() {
    this.repository = getRepository(Specification);
  }

  async findById(id: string): Promise<Specification | undefined> {
    const specification = await this.repository.findOne(id);

    return specification;
  }

  async findByName(name: string): Promise<Specification | undefined> {
    const specification = await this.repository.findOne({ name });

    return specification;
  }

  async findByDescription(
    description: string,
  ): Promise<Specification | undefined> {
    const specification = await this.repository.findOne({ description });

    return specification;
  }

  async listAll(): Promise<Specification[]> {
    const specifications = await this.repository.find();
    return specifications;
  }

  /* async findByIds(ids: string[]): Promise<Specification[]> {
    const specifications = await this.repository.find({
      where: {
        id: In(ids),
      },
    });

    return specifications;
  } */

  async findByIds(ids: string[]): Promise<Specification[]> {
    const specifications = await this.repository.findByIds(ids);

    return specifications;
  }

  public async findAllSpecificationPagination(
    object: ISpecificationPageDTO,
  ): Promise<ITotalSpecificationsDTO> {
    const { page, pageSize, query } = object;

    const [result, total] = await this.repository.findAndCount({
      where: {
        name: Raw(alias => `${alias} ILIKE '${query}'`),
      },
      order: { name: 'ASC' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return { result, total };
  }

  public async create(
    specification: ICreateSpecificationDTO,
  ): Promise<Specification> {
    const newSpecification = this.repository.create(specification);

    await this.repository.save(newSpecification);

    return newSpecification;
  }

  public async save(specification: Specification): Promise<Specification> {
    return this.repository.save(specification);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { SpecificationsRepository };
