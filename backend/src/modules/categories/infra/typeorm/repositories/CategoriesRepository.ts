import { getRepository, Raw, Repository } from 'typeorm';

import ICategoryPageDTO from '@modules/categories/dtos/ICategoryPageDTO';
import { ICreateCategoryDTO } from '@modules/categories/dtos/ICreateCategoryDTO';
import ITotalCategoriesDTO from '@modules/categories/dtos/ITotalCategoriesDTO';

import { ICategoriesRepository } from '../../../repositories/ICategoriesRepository';
import { Category } from '../entities/Category';

class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  async findById(id: string): Promise<Category | undefined> {
    const category = await this.repository.findOne(id);

    return category;
  }

  async findByName(name: string): Promise<Category | undefined> {
    const category = await this.repository.findOne({ name });

    return category;
  }

  async findByDescription(description: string): Promise<Category | undefined> {
    const category = await this.repository.findOne({ description });

    return category;
  }

  async listAll(): Promise<Category[]> {
    const Categories = await this.repository.find();
    return Categories;
  }

  public async findAllCategoryPagination(
    object: ICategoryPageDTO,
  ): Promise<ITotalCategoriesDTO> {
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

  public async create(category: ICreateCategoryDTO): Promise<Category> {
    const newCategory = this.repository.create(category);

    await this.repository.save(newCategory);

    return newCategory;
  }

  public async save(category: Category): Promise<Category> {
    return this.repository.save(category);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { CategoriesRepository };
