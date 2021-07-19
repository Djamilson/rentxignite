import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SyncPullCarsService } from '@modules/cars/services/SyncPullCarsService';

class SyncPullCarsController {
  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const syncPullCar = container.resolve(SyncPullCarsService);

      const { lastPulledVersion } = req.query;

      const syncPullCars = await syncPullCar.execute({
        lastPulledVersion: Number(lastPulledVersion),
      });

      return res.json({
        latestVersion: new Date().getTime(),
        changes: {
          cars: syncPullCars,
        },
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}

export { SyncPullCarsController };
