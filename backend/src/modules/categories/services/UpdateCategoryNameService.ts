import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { Category } from '../infra/typeorm/entities/Category';
import { ICategoriesRepository } from '../repositories/ICategoriesRepository';

interface IRequest {
  id: string;
  name: string;
}

@injectable()
class UpdateCategoryNameService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute({ id, name }: IRequest): Promise<Category> {
    const checkCategoryExists = await this.categoriesRepository.findByName(
      name,
    );

    if (checkCategoryExists) {
      throw new AppError('Category already used.');
    }

    const myCategory = await this.categoriesRepository.findById(id);

    if (!myCategory) {
      throw new AppError('Category not found');
    }

    myCategory.name = name;

    return this.categoriesRepository.save(myCategory);
  }
}

export { UpdateCategoryNameService };
