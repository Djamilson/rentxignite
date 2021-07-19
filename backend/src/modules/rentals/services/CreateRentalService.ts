import { isBefore, parseISO, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import AppError from '@shared/errors/AppError';

import { Rental } from '../infra/typeorm/entities/Rental';
import { IRentalsRepository } from '../repositories/IRentalsRepository';

interface IRequest {
  user_id: string;
  car_id: string;
  startDate: Date;
  expected_return_date: Date;
}

@injectable()
class CreateRentalService {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    user_id,
    car_id,
    startDate,
    expected_return_date,
  }: IRequest): Promise<Rental | undefined> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError('There not find any user with the givan id', 401);
    }

    const carExists = await this.carsRepository.findById(car_id);

    if (!carExists) {
      throw new AppError('There not find any car with the givan id', 402);
    }

    console.log('==>>> ppp', startDate, expected_return_date);
    const compareDateFormatStart = `${format(
      startDate,
      'yyyy-MM-dd',
    )}T23:59:00.000Z`;

    const compareDateFormatexpectedReturn = `${format(
      expected_return_date,
      'yyyy-MM-dd',
    )}T23:59:59.000Z`;

    if (isBefore(parseISO(compareDateFormatStart), Date.now())) {
      throw new AppError("You can't create an rental on a past date.", 403);
    }

    if (
      isBefore(
        parseISO(compareDateFormatexpectedReturn),
        parseISO(compareDateFormatStart),
      )
    ) {
      throw new AppError(
        "You can't create an rental on expected_return_date a past date.",
        404,
      );
    }

    const myArrayDate = this.dateProvider.arrayDates(
      startDate,
      expected_return_date,
    );

    const carUnavailables = await this.rentalsRepository.listOpenRentalByCarId(
      car_id,
    );

    const userUnavailables = await this.rentalsRepository.listOpenRentalByUserId(
      user_id,
    );

    const checkRentalCar = this.dateProvider.checkDateAvaileble(
      myArrayDate,
      carUnavailables,
    );

    if (checkRentalCar) {
      throw new AppError('Invalid return time car!', 405);
    }

    const checkRentalUser = this.dateProvider.checkDateAvaileble(
      myArrayDate,
      userUnavailables,
    );

    if (checkRentalUser) {
      throw new AppError('Invalid return time user!', 406);
    }
    //

    return this.rentalsRepository.create({
      user_id,
      car_id,
      start_date: new Date(compareDateFormatStart),
      status: 'Em aberto',
      expected_return_date: new Date(compareDateFormatexpectedReturn),
      total: Number(
        this.dateProvider.quantityDays(startDate, expected_return_date) *
          carExists.price,
      ),
    });
  }
}

export { CreateRentalService };
