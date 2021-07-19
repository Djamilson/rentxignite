import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateCategoryNameService } from '@modules/categories/services/UpdateCategoryNameService';

class UpdateNameCategoriesController {
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId } = req.params;

      const { name } = req.body;

      const updateCategory = container.resolve(UpdateCategoryNameService);

      const category = await updateCategory.execute({
        id: categoryId,
        name,
      });
      return res.json(classToClass(category));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}

export { UpdateNameCategoriesController };
