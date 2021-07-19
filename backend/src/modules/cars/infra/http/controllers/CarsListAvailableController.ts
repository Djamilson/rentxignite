import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListCarsAvailable } from '@modules/cars/services/ListCarsAvailable';

class CarsListAvailableController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { name, brand, category_id } = req.query;

    const list = container.resolve(ListCarsAvailable);

    const cars = await list.execute({
      brand: brand as string,
      category_id: category_id as string,
      name: name as string,
    });

    return res.json(classToClass(cars));
  }
}

export { CarsListAvailableController };
