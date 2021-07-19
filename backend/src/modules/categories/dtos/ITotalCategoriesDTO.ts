import { Category } from '../infra/typeorm/entities/Category';

export default interface ITotalCategoriesDTO {
  result: Category[];
  total: number;
}
