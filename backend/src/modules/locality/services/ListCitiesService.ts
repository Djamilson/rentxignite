import { inject, injectable } from 'tsyringe';

import City from '../infra/typeorm/entities/City';
import ICitiesRepository from '../repositories/ICitiesRepository';

interface ICity {
  value: string;
  label: string;
}

interface IRequest {
  state_id: string;
  page: number;
  pageSize: number;
  query: string;
}

interface ICityReturn {
  cities: ICity[] | undefined;

  cityInfo: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}

@injectable()
class ListCitiesService {
  constructor(
    @inject('CitiesRepository')
    private citiesRepository: ICitiesRepository,
  ) {}

  public async execute({
    state_id,
    page,
    pageSize,
    query,
  }: IRequest): Promise<ICityReturn | undefined> {
    const { result, total } = await this.citiesRepository.findAndCount({
      state_id,
      page,
      pageSize,
      query,
    });
    const pages = Math.ceil(total / pageSize);

    const cityInfo = { page, pages, total, limit: pageSize };

    const options = result?.map((city: City) => ({
      value: city.id,
      label: city.name,
    }));

    return { cities: options, cityInfo };
  }
}

export default ListCitiesService;
