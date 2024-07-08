import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { RajaOngkirService } from '@/services/rajaOngkir.services';

export class RajaOngkirController {
  rajaOngkirController = Container.get(RajaOngkirService);

  public getCityIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { cityName } = req.body;
      const cityId = await this.rajaOngkirController.getCityIdService({
        cityName,
      });

      res.status(200).json({ cityId });
    } catch (error) {
      next(error);
    }
  };
}
