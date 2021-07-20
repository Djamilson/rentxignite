import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SyncPullRentalsService } from '@modules/rentals/services/SyncPullRentalsService';

interface IRes {
  id: string;
  updated_at: string;
}
class SyncPullRentalsController {
  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;
      const syncPullCar = container.resolve(SyncPullRentalsService);

      const { lastPulledVersion, rentals } = req.query;

      console.log('PPasd', rentals as unknown);

      const syncPullRentals = await syncPullCar.execute({
        user_id,
        lastPulledVersion: Number(lastPulledVersion),
        rentals: ((rentals as unknown) as IRes[]) || [],
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
