import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateThumbnailService } from '@modules/cars/services/CreateThumbnailService';

class CarThumbnailController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const createCar = container.resolve(CreateThumbnailService);

      const { carId } = req.params;

      const photo = await createCar.execute({
        car_id: carId,
        photoFilename: req.file?.filename,
      });

      return res.json(classToClass(photo));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}

export { CarThumbnailController };
