import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateCar } from '@modules/cars/services/CreateCar';
import { ListCarById } from '@modules/cars/services/ListCarById';
import { ListCars } from '@modules/cars/services/ListCars';

export default class CarsController {
  async show(request: Request, response: Response): Promise<Response> {
    const listCarById = container.resolve(ListCarById);

    console.log('Meu carro:', request.params);
    const car = await listCarById.execute(request.params.carId);

    return response.status(200).json(car);
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const listCars = container.resolve(ListCars);
      const cars = await listCars.execute();

      return res.status(200).json(classToClass(cars));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const createCar = container.resolve(CreateCar);

      const {
        name,
        daily_rate,
        license_plate,
        fine_amount,
        brand,
        about,
        period,
        price,
        fuel_type,

        category_id,
        specifications,
      } = req.body;

      const car = await createCar.execute({
        name,
        daily_rate,
        license_plate,
        fine_amount,
        brand,

        about,
        period,
        price,
        fuel_type,

        category_id,
        specifications,
      });

      return res.json(classToClass(car));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
