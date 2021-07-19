import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { Category } from '../infra/typeorm/entities/Category';
import { ICategoriesRepository } from '../repositories/ICategoriesRepository';

interface IRequest {
  id: string;
  description: string;
}

@injectable()
class UpdateCategoryDescriptionService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute({ id, description }: IRequest): Promise<Category> {
    const myCategory = await this.categoriesRepository.findById(id);

    if (!myCategory) {
      throw new AppError('Category not found');
    }

    myCategory.description = description;

    return this.categoriesRepository.save(myCategory);
  }
}

export { UpdateCategoryDescriptionService };
