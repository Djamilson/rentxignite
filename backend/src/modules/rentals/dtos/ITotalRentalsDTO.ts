import { Rental } from '../infra/typeorm/entities/Rental';

export default interface ITotalRentalsDTO {
  result: Rental[];
  total: number;
}
