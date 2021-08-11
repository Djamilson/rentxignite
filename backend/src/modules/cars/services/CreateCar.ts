import { inject, injectable } from 'tsyringe';

import { ISpecificationsRepository } from '@modules/specifications/repositories/ISpecificationsRepository';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import { Car } from '../infra/typeorm/entities/Car';
import { ICarsRepository } from '../repositories/ICarsRepository';

interface IRequest {
  name: string;
  daily_rate: number;
  license_plate: string;
  fine_amount: number;
  brand: string;

  about: string;
  period: string;
  price: number;
  fuel_type: string;

  category_id: string;

  specifications: string[];
  id?: string;
}

@injectable()
class CreateCar {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute(data: IRequest): Promise<Car | undefined> {
    const checkCarExists = await this.carsRepository.findByLicensePlate(
      data.license_plate,
    );

    if (checkCarExists) {
      throw new AppError('Car already used.');
    }

    const existentSpecifications = await this.specificationsRepository.findByIds(
      data.specifications,
    );

    if (!existentSpecifications.length) {
      throw new AppError('Could not find specification with the ids');
    }

    const specificationsExistsIds = existentSpecifications.map(
      specification => specification.id,
    );

    const checkInexistentSpecification = data.specifications.filter(
      specification => !specificationsExistsIds.includes(specification),
    );

    if (checkInexistentSpecification.length) {
      throw new AppError(
        `Could not find product ${checkInexistentSpecification[0]}`,
      );
    }

    const newCar = await this.carsRepository.create({
      ...data,
      available: true,
      specifications: existentSpecifications,
    });

    const cachekey = `cars`;

    await this.cacheProvider.invalidatePrefix(cachekey);

    return this.carsRepository.save(newCar);
  }
}

export { CreateCar };
