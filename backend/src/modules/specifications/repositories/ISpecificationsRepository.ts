import { ICreateSpecificationDTO } from '../dtos/ICreateSpecificationDTO';
import ISpecificationPageDTO from '../dtos/ISpecificationPageDTO';
import ITotalSpecificationsDTO from '../dtos/ITotalSpecificationsDTO';
import { Specification } from '../infra/typeorm/entities/Specification';

interface ISpecificationsRepository {
  findByName(name: string): Promise<Specification | undefined>;
  findByDescription(description: string): Promise<Specification | undefined>;

  findById(id: string): Promise<Specification | undefined>;
  listAll(): Promise<Specification[]>;
  findAllSpecificationPagination(
    object: ISpecificationPageDTO,
  ): Promise<ITotalSpecificationsDTO>;

  findByIds(ids: string[]): Promise<Specification[]>;

  create(data: ICreateSpecificationDTO): Promise<Specification>;
  save(user: Specification): Promise<Specification>;
  delete(id: string): Promise<void>;
}

export { ISpecificationsRepository };
