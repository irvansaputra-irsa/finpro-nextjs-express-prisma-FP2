import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import { WarehouseService } from '@/services/warehouse.service';

export class WarehouseController {
  warehouseService = Container.get(WarehouseService);
  public getAllWarehouseController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { restricted } = req.query;
      const { role, id } = req.user;
      const data = await this.warehouseService.getAllWarehouseService(
        Boolean(restricted),
        role,
        id,
      );
      res.status(200).json({
        message: 'Get all warehouse list success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public findWarehouseByUserController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.warehouseService.findWarehouseByUserService(
        Number(id),
      );
      res.status(200).json({
        message: 'Get warehouse by admin success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getListWarehouseController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id, role } = req.user;
      const data = await this.warehouseService.getListWarehouseService(
        Number(id),
        role,
      );
      res.status(200).json({
        message: 'Get all list warehouse success',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
