import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateCarLicensePlateService } from '@modules/cars/services/UpdateCarLicensePlateService';

class UpdateLicensePlateCarsController {
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { carId } = req.params;

      const { license_plate } = req.body;

      const updateLicensePlate = container.resolve(
        UpdateCarLicensePlateService,
      );

      const car = await updateLicensePlate.execute({
        id: carId,
        license_plate,
      });
      return res.json(classToClass(car));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}

export { UpdateLicensePlateCarsController };
