import { getRepository, Raw, Repository } from 'typeorm';

import IStateDTO from '@modules/locality/dtos/IStateDTO';
import ITotalStateDTO from '@modules/locality/dtos/ITotalStateDTO';
import IStatesRepository from '@modules/locality/repositories/IStatesRepository';

import State from '../entities/State';

class StatesRepository implements IStatesRepository {
  private ormRepository: Repository<State>;

  constructor() {
    this.ormRepository = getRepository(State);
  }

  public async findAndCount(object: IStateDTO): Promise<ITotalStateDTO> {
    const { page, pageSize, query } = object;

    const [result, total] = await this.ormRepository.findAndCount({
      where: {
        name: Raw(alias => `${alias} ILIKE '${query}'`),
      },
      order: { name: 'ASC' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return { result, total };
  }

  public async findAll(): Promise<State[] | undefined> {
    const findAllStates = await this.ormRepository.find();

    return findAllStates;
  }
}

export default StatesRepository;
