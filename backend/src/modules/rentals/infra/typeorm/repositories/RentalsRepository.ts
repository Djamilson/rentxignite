import { Brackets, getRepository, MoreThan, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';

import { IRentalsRepository } from '../../../repositories/IRentalsRepository';
import { Rental } from '../entities/Rental';

interface IRequest {
  car_id: string;
  dateNow: Date;
}

interface IReqDate {
  lastPulledVersion: Date;
  user_id: string;
}
class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async findById(id: string): Promise<Rental | undefined> {
    const rental = await this.repository.findOne(id);

    return rental;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental | undefined> {
    const rental = await this.repository.findOne({
      where: {
        user_id,
        end_date: null,
      },
    });

    return rental;
  }

  async listOpenRentalByUserId(user_id: string): Promise<Rental[] | undefined> {
    const rentals = await this.repository.find({
      where: {
        user_id,
        end_date: null,
      },
      relations: ['car'],
      order: {
        start_date: 'ASC',
      },
    });

    return rentals;
  }

  async listRentalByUserId(user_id: string): Promise<Rental[] | undefined> {
    const rentals = await this.repository.find({
      where: {
        user_id,
      },
      relations: ['car', 'car.specifications', 'car.category', 'car.photo'],
      order: {
        start_date: 'ASC',
      },
    });

    return rentals;
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental | undefined> {
    const rental = await this.repository.findOne({
      where: {
        car_id,
        end_date: null,
      },
    });

    return rental;
  }

  async listOpenRentalByCarId(car_id: string): Promise<Rental[] | undefined> {
    const rentals = await this.repository.find({
      where: {
        car_id,
        end_date: null,
      },
    });

    return rentals;
  }

  async listAll(): Promise<Rental[]> {
    const rentals = await this.repository.find();
    return rentals;
  }

  async findAllgreaterThanOrEqualToTodayByIdRentall({
    car_id,
    dateNow,
  }: IRequest): Promise<Rental[] | undefined> {
    const rentals = await this.repository.find({
      where: (qb: any) => {
        qb.where({ car_id }).andWhere(
          new Brackets(qb3 => {
            qb3.where('expected_return_date >= :dateNow', {
              dateNow,
            });
          }),
        );
      },
    });
    return rentals;
  }

  async listByUpdated({
    user_id,
    lastPulledVersion: meDate,
  }: IReqDate): Promise<Rental[] | undefined> {
    const lastPulledVersion = meDate.toISOString().replace('T', ' ');

    const cars = await this.repository
      .createQueryBuilder()
      .where(
        'updated_at >= :lastPulledVersion AND updated_at <> created_at AND user_id = :user_id',
        {
          lastPulledVersion,
          user_id,
        },
      )
      .getMany();

    return cars;
  }

  currentUtcTimeAsSqliteString = new Date().toISOString().replace('T', ' ');

  async listByCreated({
    user_id,
    lastPulledVersion,
  }: IReqDate): Promise<Rental[] | undefined> {
    const c = lastPulledVersion.toISOString().replace('T', ' ');

    const cars = await this.repository.find({
      where: { created_at: MoreThan(c), user_id },
      relations: ['car', 'car.specifications', 'car.category', 'car.photo'],
    });

    return cars;
  }

  public async create(rental: ICreateRentalDTO): Promise<Rental> {
    const newRental = this.repository.create(rental);

    await this.repository.save(newRental);

    return newRental;
  }

  public async save(rental: Rental): Promise<Rental> {
    return this.repository.save(rental);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { RentalsRepository };
