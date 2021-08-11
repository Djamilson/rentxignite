import { isBefore, parseISO, format } from 'date-fns';
import path from 'path';
import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
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

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
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

    const myRental = await this.rentalsRepository.create({
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

    const dateFormattedStart = format(
      new Date(compareDateFormatStart),
      'dd/MM/yyyy',
    );

    const dateFormattedExpected_return = format(
      new Date(compareDateFormatexpectedReturn),
      'dd/MM/yyyy',
    );

    await this.notificationsRepository.create({
      recipient_id: myRental.id,
      content: `Nova reserva para ${dateFormattedStart} a ${dateFormattedExpected_return} `,
    });

    const createRentalTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'create_rental.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: userExists.person.name,
        email: userExists.person.email,
      },
      subject: '[RentalX] Reserva realizda com sucesso',
      templateData: {
        file: createRentalTemplate,
        variables: {
          email: userExists.person.email,
          name: userExists.person.name,
          start_date: dateFormattedStart,
          expected_return_date: dateFormattedExpected_return,
        },
      },
    });

    const cachekey = `rentals:${userExists.id}`;

    await this.cacheProvider.invalidate(cachekey);

    return myRental;
  }
}

export { CreateRentalService };
