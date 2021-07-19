import { inject, injectable } from 'tsyringe';

import { Car } from '../infra/typeorm/entities/Car';
import { ICarsRepository } from '../repositories/ICarsRepository';

interface IRequest {
  page: number;
  pageSize: number;
  query: string;
}

interface ICarsReturn {
  cars: Car[] | undefined;

  carInfo: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}

@injectable()
class ListCarsPaginationService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  public async execute({
    page,
    pageSize,
    query,
  }: IRequest): Promise<ICarsReturn> {
    const { result, total } = await this.carsRepository.findAllCarPagination({
      page,
      pageSize,
      query,
    });

    const pages = Math.ceil(total / pageSize);

    const carInfo = { page, pages, total, limit: pageSize };

    return { cars: result, carInfo };
  }
}

export default ListCarsPaginationService;
