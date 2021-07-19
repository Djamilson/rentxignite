import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';

import { IRentalsRepository } from '../repositories/IRentalsRepository';

interface IRequest {
  car_id: string;
}

@injectable()
class ListRentalByIdAndExpectReturnDateService {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ car_id }: IRequest): Promise<any | undefined> {
    const carUnavailables = await this.rentalsRepository.listOpenRentalByCarId(
      car_id,
    );

    const myArrayFinally = [] as string[];

    if (carUnavailables && carUnavailables.length > 0) {
      const arrayDate = carUnavailables.map(item => {
        const checkRentalCar = this.dateProvider.arrayDatesBD(
          item.start_date,
          item.expected_return_date,
        );

        return checkRentalCar;
      });

      arrayDate.forEach(element => {
        element.map(item => {
          return myArrayFinally.push(item);
        });
      });
    }

    return myArrayFinally;
  }
}

export { ListRentalByIdAndExpectReturnDateService };
