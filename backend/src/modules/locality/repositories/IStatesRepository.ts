import IStateDTO from '../dtos/IStateDTO';
import ITotalStateDTO from '../dtos/ITotalStateDTO';
import State from '../infra/typeorm/entities/State';

export default interface IStatesRepository {
  findAll(): Promise<State[] | undefined>;
  findAndCount(object: IStateDTO): Promise<ITotalStateDTO>;
}
