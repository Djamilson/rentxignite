import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateRegulationService } from '@modules/regulations/services/CreateRegulationService';
import { ListRegulationService } from '@modules/regulations/services/ListRegulationService';
import { UpdateRegulationService } from '@modules/regulations/services/UpdateRegulationService';

export default class RegulationsController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const listRegulation = container.resolve(ListRegulationService);

      const regulations = await listRegulation.execute();
      return res.json(classToClass(regulations));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { regulation } = req.body;

      const createRegulation = container.resolve(CreateRegulationService);

      const rental = await createRegulation.execute({
        regulation,
      });
      return res.json(classToClass(rental));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { regulation_id } = req.params;
      const { regulation } = req.body;

      const updateRegulation = container.resolve(UpdateRegulationService);

      const rental = await updateRegulation.execute({
        regulation_id,
        regulation,
      });

      return res.json(classToClass(rental));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
