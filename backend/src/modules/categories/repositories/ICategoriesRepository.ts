import ICategoryPageDTO from '../dtos/ICategoryPageDTO';
import { ICreateCategoryDTO } from '../dtos/ICreateCategoryDTO';
import ITotalCategoriesDTO from '../dtos/ITotalCategoriesDTO';
import { Category } from '../infra/typeorm/entities/Category';

interface ICategoriesRepository {
  findByName(name: string): Promise<Category | undefined>;
  findByDescription(description: string): Promise<Category | undefined>;

  findById(id: string): Promise<Category | undefined>;
  listAll(): Promise<Category[]>;
  findAllCategoryPagination(
    object: ICategoryPageDTO,
  ): Promise<ITotalCategoriesDTO>;

  create(data: ICreateCategoryDTO): Promise<Category>;
  save(user: Category): Promise<Category>;
  delete(id: string): Promise<void>;
}

export { ICategoriesRepository };
