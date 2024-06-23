import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { WarehouseService } from '@/services/warehouse.service';

export class WarehouseController {
  warehouseService = Container.get(WarehouseService);
  public getAllWarehouseController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.warehouseService.getAllWarehouseService();
      res.status(200).json({
        message: 'Add product to warehouse success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
