import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateSpecificationCar } from '@modules/cars/services/CreateSpecificationCar';

export default class SpecificationsCarsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { carId } = req.params;
      const { specifications_ids } = req.body;
      const createSpecificationCar = container.resolve(CreateSpecificationCar);

      const car = await createSpecificationCar.execute({
        car_id: carId,
        specifications_ids,
      });

      return res.json(classToClass(car));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
