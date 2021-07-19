import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateSpecificationTypeService } from '@modules/specifications/services/UpdateSpecificationTypeService';

class UpdateTypeSpecificationsController {
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { specificationId } = req.params;

      const { type } = req.body;

      const updateSpecification = container.resolve(
        UpdateSpecificationTypeService,
      );

      const specification = await updateSpecification.execute({
        id: specificationId,
        type,
      });
      return res.json(classToClass(specification));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}

export { UpdateTypeSpecificationsController };
