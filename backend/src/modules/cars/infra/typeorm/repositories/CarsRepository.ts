import { getRepository, MoreThan, Raw, Repository } from 'typeorm';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import IPageDTO from '@modules/cars/dtos/IPageDTO';
import ITotalCarsDTO from '@modules/cars/dtos/ITotalCarsDTO';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

import { Car } from '../entities/Car';

interface IRequest {
  brand?: string;
  category_id?: string;
  name?: string;
}

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async findById(id: string): Promise<Car | undefined> {
    const car = await this.repository.findOne(id);

    return car;
  }

  async findByIdAll(id: string): Promise<Car | undefined> {
    const car = await this.repository.findOne(id, {
      relations: ['specifications', 'category', 'photos'],
    });

    return car;
  }

  async listByUpdated(lastPulledVersion: Date): Promise<Car[]> {
    const cars = await this.repository
      .createQueryBuilder()
      .where(
        'updated_at >= :lastPulledVersion AND updated_at <> created_at AND available = true',
        {
          lastPulledVersion,
        },
      )
      .getMany();

    return cars;
  }

  async listByCreated(lastPulledVersion: Date): Promise<Car[]> {
    const cars = await this.repository.find({
      where: { created_at: MoreThan(lastPulledVersion), available: true },
      relations: ['photo'],
    });

    return cars;
  }

  async findByLicensePlate(license_plate: string): Promise<Car | undefined> {
    const car = await this.repository.findOne({ license_plate });

    return car;
  }

  async listAvailable(available: boolean): Promise<Car[] | undefined> {
    const car = await this.repository.find({ available });

    return car;
  }

  async findAvailable({
    brand,
    name,
    category_id,
  }: IRequest): Promise<Car[] | undefined> {
    const carsQuery = this.repository
      .createQueryBuilder('c')
      .where('available=: available', { available: true });

    if (brand) {
      carsQuery.andWhere('brand = :brand', { brand });
    }

    if (name) {
      carsQuery.andWhere('name = :name', { name });
    }

    if (category_id) {
      carsQuery.andWhere('category_id = :category_id', { category_id });
    }

    const cars = await carsQuery.getMany();

    return cars;
  }

  async listAll(): Promise<Car[]> {
    const Cars = await this.repository.find({
      relations: ['specifications', 'category', 'photos', 'photo'],
      order: {
        name: 'ASC',
      },
    });
    return Cars;
  }

  public async findAllCarPagination(object: IPageDTO): Promise<ITotalCarsDTO> {
    const { page, pageSize, query } = object;

    const [result, total] = await this.repository.findAndCount({
      where: {
        name: Raw(alias => `${alias} ILIKE '${query}'`),
      },
      order: { name: 'ASC' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return { result, total };
  }

  public async create(car: ICreateCarDTO): Promise<Car> {
    const newCar = this.repository.create(car);

    await this.repository.save(newCar);

    return newCar;
  }

  public async save(car: Car): Promise<Car> {
    return this.repository.save(car);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { CarsRepository };
