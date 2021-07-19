import { inject, injectable } from 'tsyringe';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICarsRepository } from '../repositories/ICarsRepository';

@injectable()
class ListCars {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute(): Promise<Car[]> {
    const cars = await this.carsRepository.listAll();

    return cars;
  }
}

export { ListCars };
