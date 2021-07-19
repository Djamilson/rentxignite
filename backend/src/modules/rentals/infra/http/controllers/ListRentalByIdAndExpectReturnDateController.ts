import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListRentalByIdAndExpectReturnDateService } from '@modules/rentals/services/ListRentalByIdAndExpectReturnDateService';

class ListRentalByIdAndExpectReturnDateController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { carId } = req.params;

    const list = container.resolve(ListRentalByIdAndExpectReturnDateService);

    const datesRental = await list.execute({
      car_id: carId,
    });

    return res.json(classToClass(datesRental));
  }
}

export { ListRentalByIdAndExpectReturnDateController };
