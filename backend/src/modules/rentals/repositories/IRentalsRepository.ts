import { ICreateRentalDTO } from '../dtos/ICreateRentalDTO';
import { Rental } from '../infra/typeorm/entities/Rental';

interface IRequest {
  car_id: string;
  dateNow: Date;
}

interface IReqDate {
  lastPulledVersion: Date;
  user_id: string;
}
interface IRentalsRepository {
  findById(id: string): Promise<Rental | undefined>;
  listAll(): Promise<Rental[]>;

  listByUpdated({
    lastPulledVersion,
    user_id,
  }: IReqDate): Promise<Rental[] | undefined>;
  listByCreated({
    lastPulledVersion,
    user_id,
  }: IReqDate): Promise<Rental[] | undefined>;

  findOpenRentalByUser(user_id: string): Promise<Rental | undefined>;
  findOpenRentalByCar(car_id: string): Promise<Rental | undefined>;

  listRentalByUserId(user_id: string): Promise<Rental[] | undefined>;

  listOpenRentalByUserId(user_id: string): Promise<Rental[] | undefined>;
  listOpenRentalByCarId(car_id: string): Promise<Rental[] | undefined>;

  findAllgreaterThanOrEqualToTodayByIdRentall({
    car_id,
    dateNow,
  }: IRequest): Promise<Rental[] | undefined>;

  create(data: ICreateRentalDTO): Promise<Rental>;
  save(user: Rental): Promise<Rental>;
  delete(id: string): Promise<void>;
}

export { IRentalsRepository };
