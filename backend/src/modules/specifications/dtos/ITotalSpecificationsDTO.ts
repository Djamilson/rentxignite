import { Specification } from '../infra/typeorm/entities/Specification';

export default interface ITotalSpecificationsDTO {
  result: Specification[];
  total: number;
}
