import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListCategoriesPaginationService from '@modules/categories/services/ListCategoriesPaginationService';

class CategoriesListPaginationController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { page, limit, q } = req.query;
    const pageSize = limit;

    const query = `%${q || ''}%`; // string de consulta

    const list = container.resolve(ListCategoriesPaginationService);

    const categories = await list.execute({
      page: Number(page),
      pageSize: Number(pageSize),
      query,
    });

    return res.json(classToClass(categories));
  }
}

export { CategoriesListPaginationController };
