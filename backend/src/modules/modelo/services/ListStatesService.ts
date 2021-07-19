import { inject, injectable } from 'tsyringe';

import State from '../infra/typeorm/entities/State';
import IStatesRepository from '../repositories/IStatesRepository';

interface IState {
  value: string;
  label: string;
}

interface IRequest {
  page: number;
  pageSize: number;
  query: string;
}

interface IStateReturn {
  states: IState[] | undefined;

  stateInfo: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}

@injectable()
class ListStatesService {
  constructor(
    @inject('StatesRepository')
    private statesRepository: IStatesRepository,
  ) {}

  public async execute({
    page,
    pageSize,
    query,
  }: IRequest): Promise<IStateReturn | undefined> {
    const { result, total } = await this.statesRepository.findAndCount({
      page,
      pageSize,
      query,
    });
    const pages = Math.ceil(total / pageSize);

    const stateInfo = { page, pages, total, limit: pageSize };

    const options = result?.map((state: State) => ({
      value: state.id,
      label: state.name,
    }));

    return { states: options, stateInfo };
  }
}

export default ListStatesService;
