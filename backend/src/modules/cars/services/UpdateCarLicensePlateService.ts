import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { Car } from '../infra/typeorm/entities/Car';
import { ICarsRepository } from '../repositories/ICarsRepository';

interface IRequest {
  id: string;
  license_plate: string;
}

@injectable()
class UpdateCarLicensePlateService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  public async execute({ id, license_plate }: IRequest): Promise<Car> {
    const myCar = await this.carsRepository.findById(id);

    if (!myCar) {
      throw new AppError('Car not found');
    }

    myCar.license_plate = license_plate;

    return this.carsRepository.save(myCar);
  }
}

export { UpdateCarLicensePlateService };
