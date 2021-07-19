import { inject, injectable } from 'tsyringe';

import { Specification } from '../infra/typeorm/entities/Specification';
import { ISpecificationsRepository } from '../repositories/ISpecificationsRepository';

interface IRequest {
  page: number;
  pageSize: number;
  query: string;
}

interface ISpecificationsReturn {
  specifications: Specification[] | undefined;

  specificationInfo: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}

@injectable()
class ListSpecificationsPaginationService {
  constructor(
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,
  ) {}

  public async execute({
    page,
    pageSize,
    query,
  }: IRequest): Promise<ISpecificationsReturn> {
    const {
      result,
      total,
    } = await this.specificationsRepository.findAllSpecificationPagination({
      page,
      pageSize,
      query,
    });

    const pages = Math.ceil(total / pageSize);

    const specificationInfo = { page, pages, total, limit: pageSize };

    return { specifications: result, specificationInfo };
  }
}

export default ListSpecificationsPaginationService;
