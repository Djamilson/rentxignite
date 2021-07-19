import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateSpecificationNameService } from '@modules/specifications/services/UpdateSpecificationNameService';

class UpdateNameSpecificationsController {
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { specificationId } = req.params;

      const { name } = req.body;

      const updateSpecification = container.resolve(
        UpdateSpecificationNameService,
      );

      const specification = await updateSpecification.execute({
        id: specificationId,
        name,
      });
      return res.json(classToClass(specification));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}

export { UpdateNameSpecificationsController };
