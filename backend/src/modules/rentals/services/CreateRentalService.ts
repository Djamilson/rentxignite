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
    console.log('Errro mm 001');
    if (!userExists) {
      throw new AppError('There not find any user with the givan id', 401);
    }

    const carExists = await this.carsRepository.findById(car_id);

    console.log('Errro mm 013');
    if (!carExists) {
      throw new AppError('There not find any car with the givan id', 402);
    }

    console.log('Errro mm 014');
    const compareDateFormatStart = `${format(
      startDate,
      'yyyy-MM-dd',
    )}T23:59:00.000Z`;

    const compareDateFormatexpectedReturn = `${format(
      expected_return_date,
      'yyyy-MM-dd',
    )}T23:59:59.000Z`;

    console.log('Errro mm 01115');
    if (isBefore(parseISO(compareDateFormatStart), Date.now())) {
      throw new AppError("You can't create an rental on a past date.", 403);
    }

    console.log('Errro mm 011116');
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

    console.log('Errro mm 01117');
    const myArrayDate = this.dateProvider.arrayDates(
      startDate,
      expected_return_date,
    );

    const carUnavailables = await this.rentalsRepository.listOpenRentalByCarId(
      car_id,
    );

    console.log('Errro mm 01118');
    const userUnavailables = await this.rentalsRepository.listOpenRentalByUserId(
      user_id,
    );

    const checkRentalCar = this.dateProvider.checkDateAvaileble(
      myArrayDate,
      carUnavailables,
    );

    console.log('Errro mm 01119');

    if (checkRentalCar) {
      throw new AppError('Invalid return time car!', 405);
    }

    console.log('Errro mm 011130');
    const checkRentalUser = this.dateProvider.checkDateAvaileble(
      myArrayDate,
      userUnavailables,
    );

    console.log('Errro mm 0111130');
    if (checkRentalUser) {
      throw new AppError('Invalid return time user!', 406);
    }
    console.log('Errro mm 01111');

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

    console.log('Errro mm 01');

    const dateFormattedStart = format(
      new Date(compareDateFormatStart),
      'dd/MM/yyyy',
    );

    console.log('Errro mm 02');

    const dateFormattedExpected_return = format(
      new Date(compareDateFormatexpectedReturn),
      'dd/MM/yyyy',
    );

    console.log('Errro mm 03');
    await this.notificationsRepository.create({
      recipient_id: myRental.id,
      content: `Nova reserva para ${dateFormattedStart} a ${dateFormattedExpected_return} `,
    });

    console.log('Errro mm 04');

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

    console.log('Errro mm 05');

    const cachekey = `rentals:${userExists.id}`;

    try {
      await this.cacheProvider.save(cachekey, {
        created: [myRental],
        updated: [],
        deleted: [],
      });

      console.log('Errro mm 06');
    } catch (error) {
      console.log('Errro mm 0996', error);
    }

    return myRental;
  }
}

export { CreateRentalService };
