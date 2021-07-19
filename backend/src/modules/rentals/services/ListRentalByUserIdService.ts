import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

import { IRentalsRepository } from '../repositories/IRentalsRepository';

interface IRequest {
  user_id: string;
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
interface IResponse {
  id: string;
  car_id: string;
  user_id: string;
  status: string;
  start_date: Date;
  end_date: Date;
  expected_return_date: Date;
  total: number;
  canceled_at: Date;
  car: IResCar;
}

@injectable()
class ListRentalByUserIdService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
  ) {}

  async execute({ user_id }: IRequest): Promise<IResponse[] | undefined> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError('There not find any user with the givan id', 401);
    }

    const rentals = await this.rentalsRepository.listRentalByUserId(user_id);
    let mysRentals;

    if (rentals !== undefined && rentals?.length > 0) {
      mysRentals = rentals?.map(item => {
        return {
          ...item,
          car: {
            id: item.car.id,
            name: item.car.name,
            brand: item.car.brand,
            about: item.car.about,
            license_plate: item.car.license_plate,
            available: item.car.available,
            daily_rate: Number(item.car.daily_rate),
            fine_amount: Number(item.car.fine_amount),
            period: item.car.period,
            price: Number(item.car.price),
            fuel_type: item.car.fuel_type,
            category_id: item.car.category.id,
            category_name: item.car.category.name,
            category_description: item.car.category.description,
            thumbnail: item.car?.photo?.photo,
            photo_url: item.car?.photo?.getAvatarUrl(),
          },
        };
      });
    }

    return mysRentals;
  }
}

export { ListRentalByUserIdService };
