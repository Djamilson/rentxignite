import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateSpecificationDescriptionService } from '@modules/specifications/services/UpdateSpecificationDescriptionService';

class UpdateDescriptionSpecificationsController {
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { specificationId } = req.params;

      const { description } = req.body;

      const updateSpecification = container.resolve(
        UpdateSpecificationDescriptionService,
      );

      const specification = await updateSpecification.execute({
        id: specificationId,
        description,
      });
      return res.json(classToClass(specification));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}

export { UpdateDescriptionSpecificationsController };
