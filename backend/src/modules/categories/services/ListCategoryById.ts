import { inject, injectable } from 'tsyringe';

import { Category } from '../infra/typeorm/entities/Category';
import { ICategoriesRepository } from '../repositories/ICategoriesRepository';

@injectable()
class ListCategoryById {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(id: string): Promise<Category | undefined> {
    const category = await this.categoriesRepository.findById(id);

    return category;
  }
}

export { ListCategoryById };
