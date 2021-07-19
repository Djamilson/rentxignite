import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateRentalService } from '@modules/rentals/services/CreateRentalService';
import { ListRentalByUserIdService } from '@modules/rentals/services/ListRentalByUserIdService';

export default class RentalsController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const listRental = container.resolve(ListRentalByUserIdService);

      const rentals = await listRental.execute({
        user_id,
      });
      return res.json(classToClass(rentals));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const { carId, expected_return_date, startDate } = req.body;

      const createRental = container.resolve(CreateRentalService);

      const rental = await createRental.execute({
        user_id,
        car_id: carId,
        expected_return_date: new Date(expected_return_date),
        startDate: new Date(startDate),
      });
      return res.json(classToClass(rental));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
