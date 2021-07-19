import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateCarService } from '@modules/cars/services/UpdateCarService';

class UpdateCarsController {
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { carId } = req.params;

      const updateCar = container.resolve(UpdateCarService);

      const car = await updateCar.execute({
        id: carId,
        ...req.body,
      });
      return res.json(classToClass(car));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}

export { UpdateCarsController };
