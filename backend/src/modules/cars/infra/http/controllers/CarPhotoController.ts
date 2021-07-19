import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateCarPhotoService } from '@modules/cars/services/CreateCarPhotoService';
import { UpdateCarPhotoService } from '@modules/cars/services/UpdateCarPhotoService';

class CarPhotoController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const createCar = container.resolve(CreateCarPhotoService);

      const { carId } = req.params;

      const photo = await createCar.execute({
        car_id: carId,
        photoFilename: req.file.filename,
      });

      return res.json(classToClass(photo));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const updateCar = container.resolve(UpdateCarPhotoService);

      const { photoId } = req.params;

      const photo = await updateCar.execute({
        photo_id: photoId,
        photoFilename: req.file.filename,
      });

      return res.json(classToClass(photo));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}

export { CarPhotoController };
