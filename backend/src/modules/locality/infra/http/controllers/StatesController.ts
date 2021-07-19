import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListStatesService from '@modules/locality/services/ListStatesService';

export default class StatesController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { page, limit, q } = req.query;
    const pageSize = limit;

    const query = `%${q || ''}%`; // string de consulta

    const listStates = container.resolve(ListStatesService);
    const states = await listStates.execute({
      page: Number(page),
      pageSize: Number(pageSize),
      query,
    });

    return res.json(classToClass(states));
  }
}
