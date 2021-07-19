import { inject, injectable } from 'tsyringe';

import { Car } from '../infra/typeorm/entities/Car';
import { ICarsRepository } from '../repositories/ICarsRepository';

interface IRequest {
  lastPulledVersion: number;
}

interface IResCar {
  id: string;
  name: string;
  brand: string;
  about: string;
  license_plate: string;
  available: boolean;
  daily_rate: number;
  fine_amount: number;
  period: string;
  price: number;
  fuel_type: string;
  category_id: string;
  category_name: string;
  category_description: string;
  thumbnail: string;
  photo_url: string | null;
}

interface IResponseData {
  created: IResCar[];
  updated: IResCar[];
  deleted: [];
}

@injectable()
class SyncPullCarsService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  public async execute({
    lastPulledVersion,
  }: IRequest): Promise<IResponseData> {
    let onlyNews = [] as IResCar[];
    let onlyUpdated = [] as IResCar[];

    let flagOnlyNews = [] as Car[];
    let flagOnlyUpdated = [] as Car[];

    if (lastPulledVersion === 0) {
      flagOnlyNews = await this.carsRepository.listAll();
    } else {
      flagOnlyNews = await this.carsRepository.listByCreated(
        new Date(lastPulledVersion),
      );
      flagOnlyUpdated = await this.carsRepository.listByUpdated(
        new Date(lastPulledVersion),
      );
    }

    onlyNews = flagOnlyNews?.map(car => {
      return {
        id: car.id,
        name: car.name,
        brand: car.brand,
        about: car.about,
        license_plate: car.license_plate,
        available: car.available,
        daily_rate: Number(car.daily_rate),
        fine_amount: Number(car.fine_amount),
        period: car.period,
        price: Number(car.price),
        fuel_type: car.fuel_type,
        category_id: car.category.id,
        category_name: car.category.name,
        category_description: car.category.description,
        thumbnail: car?.photo?.photo,
        photo_url: car?.photo?.getAvatarUrl(),
      };
    });

    onlyUpdated = flagOnlyUpdated
      ?.filter(car => car.created_at !== car.updated_at)
      ?.map(car => {
        return {
          id: car.id,
          name: car.name,
          brand: car.brand,
          about: car.about,
          license_plate: car.license_plate,
          available: car.available,
          daily_rate: Number(car.daily_rate),
          fine_amount: Number(car.fine_amount),
          period: car.period,
          price: Number(car.price),
          fuel_type: car.fuel_type,
          category_id: car.category.id,
          category_name: car.category.name,
          category_description: car.category.description,
          thumbnail: car?.photo?.photo,
          photo_url: car?.photo?.getAvatarUrl(),
        };
      });
    return {
      created: onlyNews,
      updated: onlyUpdated,
      deleted: [],
    };
  }
}

export { SyncPullCarsService };
