import { differenceInMilliseconds, parseISO } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { Car } from '../infra/typeorm/entities/Car';
import { ICarsRepository } from '../repositories/ICarsRepository';

interface IRes {
  id: string;
  updated_at_: string;
}
interface IRequest {
  cars: IRes[];
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

function carX(car: Car): IResCar {
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
}

@injectable()
class SyncPullCarsService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  public async execute({ cars }: IRequest): Promise<IResponseData> {
    let onlyNews = [] as IResCar[];
    let onlyUpdated = [] as IResCar[];

    let flagOnlyNews = [] as Car[];
    let flagOnlyUpdated = [] as Car[];

    const carsBD = await this.carsRepository.listAll();

    if (cars.length < 1) {
      flagOnlyNews = carsBD;
    } else {
      flagOnlyUpdated = carsBD?.filter(item => {
        const update = cars?.find(
          (carUse: IRes) =>
            item.id === carUse.id &&
            differenceInMilliseconds(
              item.updated_at,
              parseISO(carUse.updated_at_),
            ) !== 0,
        );

        if (update) return item;
      });

      // eslint-disable-next-line consistent-return
      flagOnlyNews = carsBD?.filter(item => {
        const existRental = cars?.find(carUse => item.id === carUse.id);

        if (!existRental) return item;
      });
    }

    onlyNews = flagOnlyNews?.map(car => carX(car));

    onlyUpdated = flagOnlyUpdated?.map(car => carX(car));

    return {
      created: onlyNews,
      updated: onlyUpdated,
      deleted: [],
    };
  }
}

export { SyncPullCarsService };
