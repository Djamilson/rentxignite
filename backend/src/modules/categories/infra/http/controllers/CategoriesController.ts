import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateCategory } from '@modules/categories/services/CreateCategory';
import { ListCategories } from '@modules/categories/services/ListCategories';
import { ListCategoryById } from '@modules/categories/services/ListCategoryById';

export default class CategoriesController {
  async show(request: Request, response: Response): Promise<Response> {
    const listCategoryById = container.resolve(ListCategoryById);

    const category = await listCategoryById.execute(request.params.category_id);

    return response.status(200).json(category);
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const listCategories = container.resolve(ListCategories);
      const categories = await listCategories.execute();

      return res.status(200).json(classToClass(categories));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description } = req.body;

      const createCategory = container.resolve(CreateCategory);

      const category = await createCategory.execute({
        name,
        description,
      });
      return res.json(classToClass(category));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}
