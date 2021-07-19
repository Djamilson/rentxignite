import State from '../infra/typeorm/entities/State';

export default interface ITotalStateDTO {
  result: State[];
  total: number;
}
