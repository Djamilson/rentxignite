import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SyncPullRentalsService } from '@modules/rentals/services/SyncPullRentalsService';

class SyncPullRentalsController {
  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;
      const syncPullCar = container.resolve(SyncPullRentalsService);

      const { lastPulledVersion } = req.query;
      console.log('lastPulledVersion>>>>', lastPulledVersion);

      const syncPullRentals = await syncPullCar.execute({
        user_id,
        lastPulledVersion: Number(lastPulledVersion),
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
