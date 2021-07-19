import { inject, injectable } from 'tsyringe';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICarsRepository } from '../repositories/ICarsRepository';

interface IRequest {
  brand?: string;
  category_id?: string;
  name?: string;
}

@injectable()
class ListCarsAvailable {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute(data: IRequest): Promise<Car[] | undefined> {
    const cars = await this.carsRepository.findAvailable(data);

    return cars;
  }
}

export { ListCarsAvailable };
