import { inject, injectable } from 'tsyringe';

import { Car } from '../infra/typeorm/entities/Car';
import { ICarsRepository } from '../repositories/ICarsRepository';

@injectable()
class ListCarById {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute(id: string): Promise<Car | undefined> {
    const car = await this.carsRepository.findByIdAll(id);

    return car;
  }
}

export { ListCarById };
