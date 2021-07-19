import { inject, injectable } from 'tsyringe';

import { Category } from '@modules/categories/infra/typeorm/entities/Category';

import { ICategoriesRepository } from '../repositories/ICategoriesRepository';

@injectable()
class ListCategories {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(): Promise<Category[]> {
    const Categories = await this.categoriesRepository.listAll();

    return Categories;
  }
}

export { ListCategories };
