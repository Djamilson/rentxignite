import { ICreateCarDTO } from '../dtos/ICreateCarDTO';
import IPageDTO from '../dtos/IPageDTO';
import ITotalCarsDTO from '../dtos/ITotalCarsDTO';
import { Car } from '../infra/typeorm/entities/Car';

interface IRequest {
  brand?: string;
  category_id?: string;
  name?: string;
}

interface ICarsRepository {
  findById(id: string): Promise<Car | undefined>;
  findByIdAll(id: string): Promise<Car | undefined>;

  listByUpdated(date: Date): Promise<Car[]>;
  listByCreated(date: Date): Promise<Car[]>;

  findByLicensePlate(license_pate: string): Promise<Car | undefined>;
  listAll(): Promise<Car[]>;
  listAvailable(available: boolean): Promise<Car[] | undefined>;
  findAvailable(data: IRequest): Promise<Car[] | undefined>;

  findAllCarPagination(object: IPageDTO): Promise<ITotalCarsDTO>;

  create(data: ICreateCarDTO): Promise<Car>;
  save(user: Car): Promise<Car>;
  delete(id: string): Promise<void>;
}

export { ICarsRepository };
