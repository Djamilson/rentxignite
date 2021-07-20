import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';

import { Rental } from '../infra/typeorm/entities/Rental';
import { IRentalsRepository } from '../repositories/IRentalsRepository';

/* groups: Array<{
    id: string;
  }>; */
interface IRes {
  id: string;
  updated_at: string;
}
interface IRequest {
  lastPulledVersion: number;
  user_id: string;
  rentals: IRes[];
}

interface IResRental {
  id: string;
  car_id: string;
  user_id: string;
  status: string;
  start_date: Date;
  end_date?: Date | null;
  expected_return_date: Date;

  total: number;
  canceled_at?: Date | null;
  created_at: Date;
  updated_at_: Date;
  car_name: string;
  car_brand: string;
  car_about: string;
  car_daily_rate: number;
  car_fine_amount: number;
  car_period: string;
  car_price: number;
  car_fuel_type: string;
  car_category_id: string;
  car_category_name: string;
  car_category_description: string;
  car_thumbnail: string | null;
  car_photo_url: string | null;
}

interface IResponseData {
  created: IResRental[];
  updated: IResRental[];
  deleted: [];
}

@injectable()
class SyncPullRentalsService {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('DayjsDateProvider')
    private dayjsDateProvider: IDateProvider,
  ) {}

  public async execute({
    lastPulledVersion,
    user_id,
    rentals,
  }: IRequest): Promise<IResponseData> {
    // console.log('Array:::=>>>>>>', JSON(rentals));
    // console.log('Array:::=>>>>>> Tamanho::', rentals.length);
    console.log('==:::lastPulon>>>>', JSON.stringify(rentals, null, 2));

    // console.log('==:::lastPulon>>>> result', arrayToObject1(rentals));

    // console.log('==:::==================', JSON.parse(rentals));
    rentals?.map(item => {
      console.log('my:: ', item);
      return item;
    });

    console.log('==:::lastPulon>>>>', rentals);

    let onlyNews = [] as IResRental[] | undefined;
    let onlyUpdated = [] as IResRental[] | undefined;

    let flagOnlyNews = [] as Rental[] | undefined;
    let flagOnlyUpdated = [] as Rental[] | undefined;

    if (rentals.length < 1) {
      flagOnlyNews = await this.rentalsRepository.listRentalByUserId(user_id);
    } else {
      flagOnlyNews = await this.rentalsRepository.listByCreated({
        lastPulledVersion: new Date(lastPulledVersion),
        user_id,
      });
      flagOnlyUpdated = await this.rentalsRepository.listByUpdated({
        lastPulledVersion: new Date(lastPulledVersion),
        user_id,
      });
    }

    onlyNews = flagOnlyNews?.map(rental => {
      return {
        id: rental.id,
        car_id: rental.car_id,
        user_id: rental.user_id,
        status: rental.status,
        start_date: rental.start_date,
        end_date: rental.end_date,
        expected_return_date: rental.expected_return_date,

        total: Number(rental.total),
        canceled_at: rental.canceled_at,
        created_at: rental.created_at,
        updated_at_: rental.updated_at,

        car_name: rental.car.name,
        car_brand: rental.car.brand,
        car_about: rental.car.about,
        car_daily_rate: Number(rental.car.daily_rate),
        car_fine_amount: Number(rental.car.fine_amount),
        car_period: rental.car.period,
        car_price: rental.car.price,
        car_fuel_type: rental.car.fuel_type,
        car_category_id: rental.car.category.id,
        car_category_name: rental.car.category.name,
        car_category_description: rental.car.category.description,
        car_thumbnail: rental.car.photo.photo,
        car_photo_url: rental.car.photo.getAvatarUrl(),
      };
    });

    onlyUpdated = flagOnlyUpdated
      ?.filter(rental => rental.created_at !== rental.updated_at)
      ?.map(rental => {
        return {
          id: rental.id,
          car_id: rental.car_id,
          user_id: rental.user_id,
          status: rental.status,
          start_date: rental.start_date,
          end_date: rental.end_date,
          expected_return_date: rental.expected_return_date,

          total: Number(rental.total),
          canceled_at: rental.canceled_at,
          created_at: rental.created_at,
          updated_at_: rental.updated_at,

          car_name: rental.car.name,
          car_brand: rental.car.brand,
          car_about: rental.car.about,
          car_daily_rate: Number(rental.car.daily_rate),
          car_fine_amount: Number(rental.car.fine_amount),
          car_period: rental.car.period,
          car_price: rental.car.price,
          car_fuel_type: rental.car.fuel_type,
          car_category_id: rental.car.category.id,
          car_category_name: rental.car.category.name,
          car_category_description: rental.car.category.description,
          car_thumbnail: rental.car.photo.photo,
          car_photo_url: rental.car.photo.getAvatarUrl(),
        };
      });
    return {
      created: onlyNews || [],
      updated: onlyUpdated || [],
      deleted: [],
    };
  }
}

export { SyncPullRentalsService };
