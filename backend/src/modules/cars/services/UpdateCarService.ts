import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import { Car } from '../infra/typeorm/entities/Car';
import { ICarsRepository } from '../repositories/ICarsRepository';

interface IRequest {
  data: {
    id: string;
    name: string;
    daily_rate: number;
    fine_amount: number;
    brand: string;

    about: string;
    period: string;
    available: boolean;
    price: number;
    fuel_type: string;
    thumbnail: string;

    category_id: string;
  };
}

@injectable()
class UpdateCarService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ data }: IRequest): Promise<Car> {
    const myCar = await this.carsRepository.findById(data.id);

    if (!myCar) {
      throw new AppError('Car not found');
    }

    myCar.name = data.name;
    myCar.daily_rate = data.daily_rate;
    myCar.fine_amount = data.fine_amount;
    myCar.brand = data.brand;

    myCar.about = data.about;
    myCar.period = data.period;
    myCar.price = data.price;
    myCar.fuel_type = data.fuel_type;
    myCar.category_id = data.category_id;

    const cachekey = `cars`;

    await this.cacheProvider.invalidatePrefix(cachekey);

    return this.carsRepository.save(myCar);
  }
}

export { UpdateCarService };
