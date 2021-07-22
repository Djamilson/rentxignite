import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SyncPullRentalsService } from '@modules/rentals/services/SyncPullRentalsService';

class SyncPullRentalsController {
  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;
      const syncPullCar = container.resolve(SyncPullRentalsService);

      const { rentals } = req.query;

      const p = (rentals as unknown) as string;

      const syncPullRentals = await syncPullCar.execute({
        user_id,
        rentals:
          p.length < 3
            ? []
            : p
                .replace('[', '')
                .replace(']', '')
                .replace(/},{/g, '}},{{')
                .split('},{')
                .map(item => JSON.parse(item)),
      });

      return res.json({
        latestVersion: new Date().getTime(),
        changes: {
          rentals: syncPullRentals,
        },
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}

export { SyncPullRentalsController };
