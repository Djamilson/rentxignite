import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
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

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ id, license_plate }: IRequest): Promise<Car> {
    const myCar = await this.carsRepository.findById(id);

    if (!myCar) {
      throw new AppError('Car not found');
    }

    myCar.license_plate = license_plate;

    const cachekey = `cars`;

    await this.cacheProvider.invalidatePrefix(cachekey);

    return this.carsRepository.save(myCar);
  }
}

export { UpdateCarLicensePlateService };
