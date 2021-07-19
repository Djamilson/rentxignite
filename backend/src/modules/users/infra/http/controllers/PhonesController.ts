import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreatePhoneService from '@modules/users/services/CreatePhoneService';
import DeletePhoneService from '@modules/users/services/DeletePhoneService';
import ListPhonesService from '@modules/users/services/ListPhonesService';
import ShowPhoneService from '@modules/users/services/ShowPhoneService';
import UpdatePhoneService from '@modules/users/services/UpdatePhoneService';

export default class PhonesController {
  public async show(req: Request, res: Response): Promise<Response> {
    try {
      const { phoneId } = req.params;
      const showPhone = container.resolve(ShowPhoneService);

      const phone = await showPhone.execute({
        phoneId,
      });
      return res.json(classToClass(phone));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }

  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;
      const phones = container.resolve(ListPhonesService);

      const phone = await phones.execute({
        user_id,
      });
      return res.json(classToClass(phone));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const { phone } = req.body;

      const createPhone = container.resolve(CreatePhoneService);

      const newPhone = await createPhone.execute({
        phone,
        user_id,
      });
      return res.json(classToClass(newPhone));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id, phone, person_id } = req.body;
      const upDatePhone = container.resolve(UpdatePhoneService);

      const newPhone = await upDatePhone.execute({
        id,
        phone,
        person_id,
      });
      return res.json(classToClass(newPhone));
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }

  public async destroy(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { phoneId } = request.params;

    const phonesService = container.resolve(DeletePhoneService);
    await phonesService.execute({
      idPhone: phoneId,
    });

    return response.status(204).json({ success: true });
  }
}
