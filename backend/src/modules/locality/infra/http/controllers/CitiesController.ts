import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListCitiesService from '@modules/locality/services/ListCitiesService';

export default class CitiesController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { state_id } = req.params;
    const { page, limit, q } = req.query;
    const pageSize = limit;

    const query = `%${q || ''}%`; // string de consulta

    const listCities = container.resolve(ListCitiesService);

    const cities = await listCities.execute({
      state_id,
      page: Number(page),
      pageSize: Number(pageSize),
      query,
    });

    return res.json(classToClass(cities));
  }
}
