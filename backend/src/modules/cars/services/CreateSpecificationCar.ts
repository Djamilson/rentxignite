import { inject, injectable } from 'tsyringe';

import { ISpecificationsRepository } from '@modules/specifications/repositories/ISpecificationsRepository';

import AppError from '@shared/errors/AppError';

import { Car } from '../infra/typeorm/entities/Car';
import { ICarsRepository } from '../repositories/ICarsRepository';

interface IRequest {
  specifications_ids: string[];
  car_id: string;
}

@injectable()
class CreateSpecificationCar {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,
  ) {}

  async execute({
    car_id,
    specifications_ids,
  }: IRequest): Promise<Car | undefined> {
    const checkCarExists = await this.carsRepository.findById(car_id);

    if (!checkCarExists) {
      throw new AppError('Car does not exists.');
    }

    const specifications = await this.specificationsRepository.findByIds(
      specifications_ids,
    );

    checkCarExists.specifications = specifications;

    return this.carsRepository.create(checkCarExists);
  }
}

export { CreateSpecificationCar };
