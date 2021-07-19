import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { Category } from '../infra/typeorm/entities/Category';
import { ICategoriesRepository } from '../repositories/ICategoriesRepository';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateCategory {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(data: IRequest): Promise<Category | undefined> {
    const checkCategoryExists = await this.categoriesRepository.findByName(
      data.name,
    );

    if (checkCategoryExists) {
      throw new AppError('Category already used.');
    }

    return this.categoriesRepository.create(data);
  }
}

export { CreateCategory };
