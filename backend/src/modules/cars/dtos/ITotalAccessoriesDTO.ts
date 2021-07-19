import { Accessory } from '../infra/typeorm/entities/Accessory';

export default interface ITotalAccessoriesDTO {
  result: Accessory[];
  total: number;
}
