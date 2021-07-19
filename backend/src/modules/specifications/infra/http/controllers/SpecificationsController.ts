import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateSpecification } from '@modules/specifications/services/CreateSpecification';
import { ListSpecificationById } from '@modules/specifications/services/ListSpecificationById';
import { ListSpecifications } from '@modules/specifications/services/ListSpecifications';

export default class SpecificationsController {
  async show(request: Request, response: Response): Promise<Response> {
    const listSpecificationById = container.resolve(ListSpecificationById);

    const specification = await listSpecificationById.execute(
      request.params.specification_id,
    );

    return response.status(200).json(specification);
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const listSpecifications = container.resolve(ListSpecifications);
      const specifications = await listSpecifications.execute();

      return res.status(200).json(classToClass(specifications));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description, type } = req.body;

      const createSpecification = container.resolve(CreateSpecification);

      const specification = await createSpecification.execute({
        name,
        description,
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
