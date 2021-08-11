import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SyncPullRegulationsService } from '@modules/regulations/services/SyncPullRegulationsService';

class SyncPullRegulationsController {
  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      const syncPullRegulation = container.resolve(SyncPullRegulationsService);

      const { regulations } = req.query;

      const p = (regulations as unknown) as string;

      const syncPullRentals = await syncPullRegulation.execute({
        regulations:
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
          regulations: syncPullRentals,
        },
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, statusCode: error.statusCode });
    }
  }
}

export { SyncPullRegulationsController };
