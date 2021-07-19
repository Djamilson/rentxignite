import { Car } from '../infra/typeorm/entities/Car';

export default interface ITotalCarsDTO {
  result: Car[];
  total: number;
}
