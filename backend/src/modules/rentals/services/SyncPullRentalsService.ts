import { inject, injectable } from 'tsyringe';

import { Rental } from '../infra/typeorm/entities/Rental';
import { IRentalsRepository } from '../repositories/IRentalsRepository';
interface IRes {
  id: string;
  updated_at_: string;
}
interface IRequest {
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
  ) {}

  public async execute({ user_id, rentals }: IRequest): Promise<IResponseData> {
    let onlyNews = [] as IResRental[] | undefined;
    let onlyUpdated = [] as IResRental[] | undefined;

    let flagOnlyNews = [] as Rental[] | undefined;
    let flagOnlyUpdated = [] as Rental[] | undefined;

    const rentalsBD = await this.rentalsRepository.listRentalByUserId(user_id);

    if (rentals.length < 1) {
      flagOnlyNews = rentalsBD;
    } else {
      // eslint-disable-next-line consistent-return
      flagOnlyUpdated = rentalsBD?.filter(item => {
        const update = rentals?.find(
          (rentalUse: IRes) =>
            item.id === rentalUse.id &&
            // eslint-disable-next-line no-underscore-dangle
            String(item.updated_at) !== rentalUse.updated_at_,
        );

        if (update) return item;
      });

      // eslint-disable-next-line consistent-return
      flagOnlyNews = rentalsBD?.filter(item => {
        const existRental = rentals?.find(
          rentalUse => item.id === rentalUse.id,
        );

        if (!existRental) return item;
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

    onlyUpdated = flagOnlyUpdated?.map(rental => {
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
