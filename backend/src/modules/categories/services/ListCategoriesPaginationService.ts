import { inject, injectable } from 'tsyringe';

import { Category } from '../infra/typeorm/entities/Category';
import { ICategoriesRepository } from '../repositories/ICategoriesRepository';

interface IRequest {
  page: number;
  pageSize: number;
  query: string;
}

interface ICategoriesReturn {
  categories: Category[] | undefined;

  categoryInfo: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}

@injectable()
class ListCategoriesPaginationService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute({
    page,
    pageSize,
    query,
  }: IRequest): Promise<ICategoriesReturn> {
    const {
      result,
      total,
    } = await this.categoriesRepository.findAllCategoryPagination({
      page,
      pageSize,
      query,
    });

    const pages = Math.ceil(total / pageSize);

    const categoryInfo = { page, pages, total, limit: pageSize };

    return { categories: result, categoryInfo };
  }
}

export default ListCategoriesPaginationService;
