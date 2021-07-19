import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateSpecificationCar } from '@modules/cars/services/CreateSpecificationCar';

class UpdateSpecificationsCarsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { carId } = req.params;
      const createSpecificationCar = container.resolve(CreateSpecificationCar);

      const { specifications_ids } = req.body;

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

export { UpdateSpecificationsCarsController };
